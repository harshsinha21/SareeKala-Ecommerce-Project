import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserAuthService } from '../_services/user-auth.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../_services/user.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, MatToolbarModule, MatButtonModule, MatDividerModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  constructor(
    private userAuthService: UserAuthService,
    private router: Router,
    public userService: UserService
  ) { }
  ngOnInit(): void {
  }

  public isLoggedIn() {
    return this.userAuthService.isLoggedIn();
  }
  public logout() {
    this.userAuthService.clear();
    this.router.navigate(['/']);
  }
  public isAdmin() {
    return this.userAuthService.isAdmin();
  }
  public isUser() {
    return this.userAuthService.isUser();
  }
}
