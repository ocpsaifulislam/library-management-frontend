import { Injectable } from '@angular/core';

import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';

import {
  BehaviorSubject,
  Observable,
  throwError
} from 'rxjs';

import {
  catchError,
  filter,
  switchMap,
  take
} from 'rxjs/operators';

import { Router } from '@angular/router';

import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;

  private refreshTokenSubject =
    new BehaviorSubject<string | null>(null);

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // ----------------------------------------------------------
    // Login / Register / Refresh request
    // ----------------------------------------------------------

    if (this.isAuthRequest(request)) {
      return next.handle(request);
    }

    // ----------------------------------------------------------
    // Add Access Token
    // ----------------------------------------------------------

    const token = this.tokenService.getToken();

    if (token) {
      request = this.addToken(request, token);
    }

    // ----------------------------------------------------------
    // Execute Request
    // ----------------------------------------------------------

    return next.handle(request).pipe(

      catchError((error: HttpErrorResponse) => {

        if (error.status === 401) {

          return this.handle401Error(
            request,
            next
          );
        }

        return throwError(() => error);
      })
    );
  }

  // ============================================================
  // Check Authentication Requests
  // ============================================================

  private isAuthRequest(
    request: HttpRequest<any>
  ): boolean {

    return (
      request.url.includes('/auth/login') ||
      request.url.includes('/auth/register') ||
      request.url.includes('/auth/refresh') ||
      request.url.includes('/auth/logout')
    );
  }

  // ============================================================
  // Add Authorization Header
  // ============================================================

  private addToken(
    request: HttpRequest<any>,
    token: string
  ): HttpRequest<any> {

    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // ============================================================
  // Handle 401
  // ============================================================

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // ----------------------------------------------------------
    // Another request is already refreshing the token
    // ----------------------------------------------------------

    if (this.isRefreshing) {

      return this.refreshTokenSubject.pipe(

        filter(
          (token): token is string => token !== null
        ),

        take(1),

        switchMap((token: string) => {

          return next.handle(
            this.addToken(request, token)
          );
        }),

        catchError((error) => {

          return throwError(() => error);
        })
      );
    }

    // ----------------------------------------------------------
    // Start Refresh Process
    // ----------------------------------------------------------

    this.isRefreshing = true;

    this.refreshTokenSubject.next(null);

    const refreshToken =
      this.tokenService.getRefreshToken();

    // ----------------------------------------------------------
    // No Refresh Token
    // ----------------------------------------------------------

    if (!refreshToken) {

      this.logout();

      return throwError(
        () =>
          new Error(
            'Refresh token is not available.'
          )
      );
    }

    // ----------------------------------------------------------
    // Call Refresh API
    // ----------------------------------------------------------

    return this.authService.refreshToken().pipe(

      switchMap((response) => {

        this.isRefreshing = false;

        if (
          response.success &&
          response.body?.accessToken
        ) {

          const newAccessToken =
            response.body.accessToken;

          // Save new access token
          this.tokenService.setToken(
            newAccessToken
          );

          // Save rotated refresh token
          if (response.body.refreshToken) {

            this.tokenService.setRefreshToken(
              response.body.refreshToken
            );
          }

          // Notify waiting requests
          this.refreshTokenSubject.next(
            newAccessToken
          );

          // Retry original request
          return next.handle(
            this.addToken(
              request,
              newAccessToken
            )
          );
        }

        // Refresh failed
        this.logout();

        return throwError(
          () =>
            new Error(
              response.message ||
              'Token refresh failed.'
            )
        );
      }),

      catchError((error) => {

        this.isRefreshing = false;

        this.refreshTokenSubject.next(null);

        this.logout();

        return throwError(() => error);
      })
    );
  }

  // ============================================================
  // Logout
  // ============================================================

  private logout(): void {

    this.tokenService.clear();

    this.router.navigate(['/login'], {
      queryParams: {
        returnUrl: this.router.url
      }
    });
  }
}