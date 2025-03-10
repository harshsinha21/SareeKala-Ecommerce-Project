import { Component } from '@angular/core';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  message: any;
  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.forAdmin();
  }

  forAdmin() {
    this.userService.forAdmin().subscribe({
      next: (response) => {
        console.log(response);
        this.message = response;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}


