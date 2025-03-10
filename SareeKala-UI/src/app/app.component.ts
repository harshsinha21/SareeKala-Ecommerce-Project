import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-root',
  imports: [
    CommonModule, RouterOutlet, HeaderComponent,
    RouterModule, FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'jwt-artUI';
}
