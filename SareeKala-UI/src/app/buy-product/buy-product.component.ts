import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { OrderDetails } from '../_model/order-detais.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from '../_model/product.model';
import { ProductService } from '../_services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { AboutComponent } from "../about/about.component";


@Component({
  selector: 'app-buy-product',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule,
    MatInputModule, MatCardModule, MatButtonModule, MatGridListModule, RouterModule, MatDividerModule],
  templateUrl: './buy-product.component.html',
  styleUrl: './buy-product.component.css'
})
export class BuyProductComponent implements OnInit {

  productDetails: Product[] = [];

  orderDetails: OrderDetails = {
    fullName: '',
    fullAddress: '',
    contactNumber: '',
    orderProductQuantityList: []
  }
  constructor(private activateRoute: ActivatedRoute,
    private productService: ProductService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productDetails = this.activateRoute.snapshot.data['productDetails'];
    this.productDetails.forEach(
      x => this.orderDetails.orderProductQuantityList.push(
        {productId: x.productId!, quantity: 1}
      )
    );
    console.log("now printing product details and orderdetails");
    console.log(this.productDetails);
    console.log(this.orderDetails);
  }

  public placeOrder(orderForm: NgForm) {
    this.productService.placeOrder(this.orderDetails).subscribe(
      (response) => {
        console.log(response);
        orderForm.reset;
        this.router.navigate(['/order-success']);
      },
      (error) => {
        console.log('Order Failed', error);
      }
    );
  }

  getQuantityForProduct(productId: any) {
    const product = this.orderDetails.orderProductQuantityList.filter(
      (productQuantity) => productQuantity.productId === productId);

    return product[0].quantity;
  }

  getTotalForProduct(productId: any, productPrice: number) {
    const product = this.orderDetails.orderProductQuantityList.filter(
      (productQuantity) => productQuantity.productId === productId);

    return product[0].quantity * productPrice;
  }

  onQuantityChange(quantity: any, productId: any){
    this.orderDetails.orderProductQuantityList.filter(
      (orderProduct) => orderProduct.productId === productId)[0].quantity = quantity;
  }

  getTotalBill(){
    let getTotal = 0;
    this.orderDetails.orderProductQuantityList.forEach(
      (productQuantity) => {
        const price = this.productDetails.filter(
          product => product.productId === productQuantity.productId)[0].productPrice;
        const productTotal = price * productQuantity.quantity; 
        getTotal += productTotal;
      }
    );
    return getTotal;
  }

  

}
