import { Injectable } from '@angular/core';
import { Role } from '../_model/role.model';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor() { }


  public setRoles(roles: Role[]) {
    localStorage.setItem("roles", JSON.stringify(roles));
  }

  public getRoles(): Role[] {
    if (typeof window !== 'undefined' && localStorage.getItem('roles')) {
      return JSON.parse(localStorage.getItem('roles') || '[]');
    }
    return [];
  }

  public setToken(jwtToken: string) {
    console.log("Storing token in localStorage: ", jwtToken);
    localStorage.setItem("jwtToken", jwtToken);
  }

  public getToken(): string {
    if (typeof window !== 'undefined' && localStorage.getItem('jwtToken')) {
      return localStorage.getItem('jwtToken') || '';
    }
    return '';
  }

  public clear() {
    localStorage.removeItem('jwtToken');
    localStorage.clear();
  }

  public isLoggedIn() {
    return this.getRoles() && this.getToken();
  }

  public isAdmin() {
    const roles: any[] = this.getRoles();
    return roles[0].roleName === 'Admin';
  }

  public isUser() {
    const roles: any[] = this.getRoles();
    return roles[0].roleName === 'User';
  }
}
