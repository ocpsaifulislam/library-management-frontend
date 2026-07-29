import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

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

  clear(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
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