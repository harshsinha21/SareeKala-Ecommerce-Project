import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order-success',
  imports: [RouterModule],
  templateUrl: './order-success.component.html',
  styleUrl: './order-success.component.css'
})
export class OrderSuccessComponent implements OnInit {
  sessionId: string = '';
  orderDetail: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('OrderSuccessComponent initialized.');
  }

  goToHomePage() {
    console.log('Order placed, redirecting to home page...');
    this.router.navigate(['/home']);
  }
}
