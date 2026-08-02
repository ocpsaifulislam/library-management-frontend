import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { RegisterRequest } from '../models/register-request';
import { RegisterResponse } from '../models/register-response';

import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';

import { TokenService } from './token.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  timestamp: string;
  status: number;
  success: boolean;
  message: string;

  body: {
    accessToken: string;
    refreshToken?: string;
    tokenType?: string;
    expiresIn?: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly baseUrl = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  // ============================================================
  // Register
  // ============================================================

  register(
    data: RegisterRequest
  ): Observable<RegisterResponse> {

    return this.http.post<RegisterResponse>(
      `${this.baseUrl}${API_ENDPOINTS.AUTH.REGISTER}`,
      data
    );
  }

  // ============================================================
  // Login
  // ============================================================

  login(
    data: LoginRequest
  ): Observable<LoginResponse> {

    return this.http
      .post<LoginResponse>(
        `${this.baseUrl}${API_ENDPOINTS.AUTH.LOGIN}`,
        data
      )
      .pipe(

        tap((response: LoginResponse) => {

          if (
            response.success &&
            response.body
          ) {

            // Access Token
            if (response.body.accessToken) {

              this.tokenService.setToken(
                response.body.accessToken
              );
            }

            // Refresh Token
            if (response.body.refreshToken) {

              this.tokenService.setRefreshToken(
                response.body.refreshToken
              );
            }

            // First Name
            if (response.body.firstName) {

              this.tokenService.setFirstName(
                response.body.firstName
              );
            }

            // Last Name
            if (response.body.lastName) {

              this.tokenService.setLastName(
                response.body.lastName
              );
            }
          }
        })
      );
  }

  // ============================================================
  // Refresh Access Token
  // ============================================================

  refreshToken(): Observable<RefreshTokenResponse> {

    const refreshToken =
      this.tokenService.getRefreshToken();

    if (!refreshToken) {

      throw new Error(
        'Refresh token is not available.'
      );
    }

    const request: RefreshTokenRequest = {
      refreshToken: refreshToken
    };

    return this.http.post<RefreshTokenResponse>(
      `${this.baseUrl}${API_ENDPOINTS.AUTH.REFRESH}`,
      request
    ).pipe(

      tap((response: RefreshTokenResponse) => {

        if (
          response.success &&
          response.body?.accessToken
        ) {

          // Save NEW access token
          this.tokenService.setToken(
            response.body.accessToken
          );

          // Backend may rotate refresh token
          if (response.body.refreshToken) {

            this.tokenService.setRefreshToken(
              response.body.refreshToken
            );
          }
        }
      })
    );
  }

  // ============================================================
  // Access Token
  // ============================================================

  saveToken(token: string): void {

    this.tokenService.setToken(token);
  }

  getToken(): string | null {

    return this.tokenService.getToken();
  }

  // ============================================================
  // Authentication Status
  // ============================================================

  isLoggedIn(): boolean {

    return this.tokenService.isLoggedIn();
  }

  // ============================================================
  // Logout
  // ============================================================

  logout(): Observable<void> {

    const refreshToken =
      this.tokenService.getRefreshToken();

    const request: RefreshTokenRequest = {
      refreshToken: refreshToken || ''
    };

    return this.http
      .post<void>(
        `${this.baseUrl}${API_ENDPOINTS.AUTH.LOGOUT}`,
        request
      )
      .pipe(

        tap(() => {

          this.clearLocalSession();
        }),

        catchError((error) => {

          console.error(
            'Logout error, clearing local session:',
            error
          );

          // Even if backend logout fails,
          // remove local authentication data.
          this.clearLocalSession();

          return of(void 0);
        })
      );
  }

  // ============================================================
  // Clear Local Session
  // ============================================================

  clearLocalSession(): void {

    this.tokenService.clear();
  }
}