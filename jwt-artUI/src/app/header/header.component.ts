import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserAuthService } from '../_services/user-auth.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
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
    this.router.navigate(['/logout']);
  }
}
