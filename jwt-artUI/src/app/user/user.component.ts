import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  message: any;
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.forUser();
  }

  forUser() {
    this.userService.forUser().subscribe({
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
