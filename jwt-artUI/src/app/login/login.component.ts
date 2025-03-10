import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { UserService } from '../_services/user.service';
import { UserAuthService } from '../_services/user-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  constructor(
    private userService: UserService, 
    private userAuthService: UserAuthService,
    private router: Router) {}
  ngOnInit(): void {  
  }
  login(loginForm: NgForm) {
    this.userService.login(loginForm.value).subscribe(
      (response:any)=>{
        this.userAuthService.setRoles(response.user.role);
        this.userAuthService.setToken(response.jwtToken);
        console.log(response);
        const role = response.user.role[0].roleName;
        if(role == 'Admin'){
          this.router.navigate(['/admin']);
        } else if(role == 'User'){
          this.router.navigate(['/user']);
        } else {
          this.router.navigate(['/forbidden']);
        }
      },
      (error)=>{
        console.log(error);
      }
    );
  } 
}

export interface LoginData {
  userName: string;
  userPassword: string;
}


