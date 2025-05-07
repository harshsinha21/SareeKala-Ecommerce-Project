import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { OrderHistory } from '../_model/order-history.model';
import { MatTable, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-orders',
  imports: [MatTableModule, CommonModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css'
})
export class MyOrdersComponent implements OnInit {

  displayedColumns = ['orderId', 'orderFullName', 'orderFullOrder', 'orderContactNumber', 'orderAmount', 'orderStatus'];
  orderHistory: OrderHistory[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getOrderDetails();
  }

  getOrderDetails() {
    this.productService.getMyOrders().subscribe(
      (response: OrderHistory[]) => {
        this.orderHistory = response;
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
