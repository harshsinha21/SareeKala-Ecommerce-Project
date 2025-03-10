import { Component } from '@angular/core';
import { UserService } from '../_services/user.service';
import { UserAuthService } from '../_services/user-auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  message: any;
  constructor(
    private userService: UserService,
    private userAuthService: UserAuthService,
    private httpclient: HttpClient
  ) { }

  PATH_OF_API = "http://localhost:9090";

  ngOnInit(): void {
    this.forAdmin();
  }

  forAdmin() {
    this.userService.forAdmin().subscribe(
      (response) => {
        console.log(response);
        this.message = response;
      }, 
      (error)=>{
        console.log(error);
      }
    );
  }
}


