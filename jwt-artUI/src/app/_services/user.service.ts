import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginData } from '../login/login.component';
import { UserAuthService } from './user-auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  PATH_OF_API = "http://localhost:9090";
  requestHeader = new HttpHeaders(
    { "No-Auth": "True" }
  );
  constructor(
    private httpclient: HttpClient,
    private userAuthService: UserAuthService
  ) { }

  public login(loginData: LoginData) {
    return this.httpclient.post(this.PATH_OF_API + '/authenticate', loginData, { headers: this.requestHeader });
  }

  public forUser() {
    return this.httpclient.get(this.PATH_OF_API + '/forUser', {
      responseType: 'text',
    });
  }

  public forAdmin() {
    const token = this.userAuthService.getToken(); // Get token from localStorage
    console.log('Attempting to call /forAdmin'); // Log request attempt
    console.log('Sending request with token:', token); // Log token
  
    return this.httpclient.get(this.PATH_OF_API + '/forAdmin', {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
      responseType: 'text',
    });
  }
  

  public roleMatch(allowedRoles: string[]): boolean {
    let isMatch = false;
    const userRoles: any = this.userAuthService.getRoles();

    if (userRoles != null && userRoles) {
      for (let i = 0; i < userRoles.length; i++) {
        for (let j = 0; j < allowedRoles.length; j++) {
          if (userRoles[i].roleName == allowedRoles[j]) {
            isMatch = true;
            return isMatch;
          } else {
            return isMatch;
          }
        }
      }
    }
    return isMatch;
  }
}
