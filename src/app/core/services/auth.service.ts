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

export interface RefreshTokenRequest {
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  /**
   * Register User
   */
  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.baseUrl}/register`,
      data
    );
  }

  /**
   * Login User
   */
  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, data).pipe(
      tap((response) => {
        // Automatically store access & refresh tokens on successful login
        if (response.body.accessToken) {
          this.tokenService.setToken(response.body.accessToken);
        }
        if (response.body.refreshToken) {
          this.tokenService.setRefreshToken(response.body .refreshToken);
        }
        if (response.body.firstName) {
          this.tokenService.setFirstName(response.body.firstName);
        }
        if (response.body.lastName) {
          this.tokenService.setLastName(response.body.lastName);
        }
      })
    );
  }

  /**
   * Save JWT Access Token Manually
   */
  saveToken(token: string): void {
    this.tokenService.setToken(token);
  }

  /**
   * Get JWT Access Token
   */
  getToken(): string | null {
    return this.tokenService.getToken();
  }

  /**
   * Check Login Status
   */
  isLoggedIn(): boolean {
    return this.tokenService.isLoggedIn();
  }

  /**
   * Logout User (Sends { "refreshToken": "..." } to Spring Backend)
   */
  logout(): Observable<void> {
    const refreshToken = this.tokenService.getRefreshToken() || '';
    const payload: RefreshTokenRequest = { refreshToken };

    return this.http.post<void>(`${this.baseUrl}/logout`, payload).pipe(
      tap(() => {
        this.clearLocalSession();
      }),
      catchError((error) => {
        console.error('Logout error, clearing session locally:', error);
        this.clearLocalSession();
        return of(void 0);
      })
    );
  }

  /**
   * Clear Local Tokens/Session
   */
  clearLocalSession(): void {
    this.tokenService.clear();
  }
}