import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class DecodeTokenService {

  constructor() {}

  getToken(): string | null {
    return localStorage.getItem('token'); // أو حسب مكان تخزين التوكن
  }

  getDecodedToken(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (e) {
      return null;
    }
  }

  getUserRoles(): string[] {
    const decoded = this.getDecodedToken();
    if (decoded && decoded['role']) {
      return Array.isArray(decoded['role']) ? decoded['role'] : [decoded['role']];
    }
    return [];
  }

  isInRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }}
