import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { STORAGE_KEYS } from '../constants/storage-keys';

interface JwtPayload {
  exp?: number;
}

@Injectable({
  providedIn: 'root',
})
export class TokenService {

  // ============================================================
  // Access Token
  // ============================================================

  setToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  // ============================================================
  // Refresh Token
  // ============================================================

  setRefreshToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  // ============================================================
  // User Information
  // ============================================================

  setFirstName(firstName: string): void {
    localStorage.setItem(STORAGE_KEYS.FIRST_NAME, firstName);
  }

  getFirstName(): string | null {
    return localStorage.getItem(STORAGE_KEYS.FIRST_NAME);
  }

  setLastName(lastName: string): void {
    localStorage.setItem(STORAGE_KEYS.LAST_NAME, lastName);
  }

  getLastName(): string | null {
    return localStorage.getItem(STORAGE_KEYS.LAST_NAME);
  }

  // ============================================================
  // Clear Authentication Data
  // ============================================================

  clear(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.FIRST_NAME);
    localStorage.removeItem(STORAGE_KEYS.LAST_NAME);
    localStorage.removeItem('loglevel');
  }

  // ============================================================
  // Authentication Status
  // ============================================================

  isLoggedIn(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    return !this.isTokenExpired();
  }

  // ============================================================
  // JWT Expiration
  // ============================================================

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

      return decoded.exp * 1000 <= Date.now();

    } catch {
      return true;
    }
  }
}