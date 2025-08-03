import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private users: any[] = [
    { email: 'Saif@saif.com', role: 'Admin' },
    { email: 'Tara@AinAlfahd.com', role: 'Admin' },
    { email: 'Karrar@AinAlfahd.com', role: 'Admin' },
    { email: 'yousif@ainalfahad.com', role: 'User' }
  ];

  private currentUser: any = null;
  constructor() {}

  login(email: string): boolean {
    const user = this.users.find(u => u.email === email);
    if (user) {
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }


  setCurrentUser(user: any): void {
    this.currentUser = user;
  }


  getCurrentUser(): any {
    if (!this.currentUser) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    }
    return this.currentUser;
  }

  hasRole(role: string): boolean {
    return this.currentUser && this.currentUser.role === role;
  }
}
