import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-registeruser',
  imports: [MatLabel, MatError, MatFormFieldModule, CommonModule, FormsModule,
    MatInputModule, MatCardModule, MatButtonModule],
  templateUrl: './registeruser.component.html',
  styleUrl: './registeruser.component.css'
})
export class RegisteruserComponent implements OnInit {

  constructor(private router: Router,
    private userService: UserService
  ) {

  }

  ngOnInit(): void {
      
  }

  user = {
    userName: '',
    userFirstName: '',
    userLastName: '',
    userPassword: ''
  };

  usernameExists = false;

  // Simulated existing usernames – replace this with a backend service call
  existingUsernames = ['alice', 'bob', 'charlie'];

  register(form: NgForm) {
    this.usernameExists = this.existingUsernames.includes(this.user.userName.trim().toLowerCase());

    if (this.usernameExists) return;

    if (form.valid) {
      this.userService.register(form.value).subscribe(
        (response) =>  {
          this.router.navigate(['/login']);
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      )
    }
  }

  login() {
    this.router.navigate(['/login']);
  }
}

  
    


