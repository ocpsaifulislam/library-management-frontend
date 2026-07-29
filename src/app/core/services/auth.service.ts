import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { RegisterRequest } from '../models/register-request';
import { RegisterResponse } from '../models/register-response';
import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';

import { TokenService } from './token.service';

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
    return this.http.post<LoginResponse>(
      `${this.baseUrl}/login`,
      data
    );
  }

  /**
   * Save JWT Access Token
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
   * Logout User
   */
  logout(): void {
    this.tokenService.clear();
  }
}