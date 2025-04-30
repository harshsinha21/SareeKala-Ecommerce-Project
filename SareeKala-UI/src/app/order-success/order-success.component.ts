import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-success',
  imports: [RouterModule],
  templateUrl: './order-success.component.html',
  styleUrl: './order-success.component.css'
})
export class OrderSuccessComponent {

  constructor(private router: Router) {}

  goToHomePage() {
    // Any logic you want to run before redirecting
    console.log('Order placed, redirecting to home page');
    this.router.navigate(['/home']);
  }

}
