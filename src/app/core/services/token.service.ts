import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly FIRST_NAME_KEY = 'first_name';
  private readonly LAST_NAME_KEY = 'last_name';

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  setFirstName(token: string): void {
    localStorage.setItem(this.FIRST_NAME_KEY, token);
  }

  getFirstName(): string | null {
    return localStorage.getItem(this.FIRST_NAME_KEY);
  }

  setLastName(token: string): void {
    localStorage.setItem(this.LAST_NAME_KEY, token);
  }

  getLastName(): string | null {
    return localStorage.getItem(this.LAST_NAME_KEY);
  }

  clear(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.FIRST_NAME_KEY);
    localStorage.removeItem(this.LAST_NAME_KEY);
    // Also remove loglevel from local storage if desired
    localStorage.removeItem('loglevel');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    return !this.isTokenExpired();
  }

  isTokenExpired(): boolean {
    const token = this.getToken();

    if (!token) {
      return true;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      if (!decoded.exp) {
        return true;
      }

      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}