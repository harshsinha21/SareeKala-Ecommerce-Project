import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { OrderHistory } from '../_model/order-history.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-all-orders',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.css'
})
export class AllOrdersComponent implements OnInit {

  displayedColumns: string[] = ['Id', 'Product Name', 'Name', 'Address', 'Contact', 'Status', 'Action'];
  dataSource: OrderHistory[] = [];
  status: string = 'All';

  constructor(private productService: ProductService){

  }

  ngOnInit(): void {
    this.getAllOrders();
  }

  getAllOrders() {
    this.productService.getAllOrders(this.status).subscribe(
      (response: OrderHistory[]) => {
        this.dataSource = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  

  markAsDelivered(orderId: number) {
    this.productService.markAsDelivered(orderId).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    )
  }

}
