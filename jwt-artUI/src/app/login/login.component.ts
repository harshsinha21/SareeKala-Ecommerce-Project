import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  constructor() {}
  ngOnInit(): void {  
  }
  login(loginForm: NgForm) {
    console.log("Form is submitted");
    console.log(loginForm.value);
    // console.log("Username:", loginForm.value.userName);
    // console.log("Password:", loginForm.value.userPassword);
  }
}


