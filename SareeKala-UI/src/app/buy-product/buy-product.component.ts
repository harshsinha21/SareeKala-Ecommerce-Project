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
import { ProductCheckoutDTO } from '../_model/product-checkout-dto.model';


@Component({
  selector: 'app-buy-product',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule,
    MatInputModule, MatCardModule, MatButtonModule, MatGridListModule, RouterModule, MatDividerModule],
  templateUrl: './buy-product.component.html',
  styleUrl: './buy-product.component.css'
})
export class BuyProductComponent implements OnInit {

  isSingleProductCheckout: any = false;

  productDetails: ProductCheckoutDTO[] = [];

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
  ) { }

  ngOnInit(): void {
    this.productDetails = this.activateRoute.snapshot.data['productDetails'];
    this.isSingleProductCheckout = this.activateRoute.snapshot.paramMap.get("isSingleProductCheckout");
    this.productDetails.forEach(x => {
      this.orderDetails.orderProductQuantityList.push({
        productId: x.productId!,
        quantity: x.quantity ?? 1 // or use: x.quantity || 1
      });
    });
    console.log("now printing product details and orderdetails");
    console.log(this.productDetails);
    console.log(this.orderDetails);
  }

  public placeOrder(orderForm: NgForm) {
    this.productService.placeOrder(this.orderDetails, this.isSingleProductCheckout).subscribe(
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

  onQuantityChange(quantity: any, productId: any) {
    const product = this.productDetails.find(p => p.productId === productId);
    const cartItemId = product?.cartItemId;

    const orderProduct = this.orderDetails.orderProductQuantityList.find(
      (productQuantity) => productQuantity.productId === productId
    );

    if (orderProduct && cartItemId) {
      orderProduct.quantity = quantity;
      this.productService.updateCartItemQuantity(cartItemId, quantity).subscribe({
        next: (resp) => console.log('Updating quantity for cartItemId:', cartItemId, 'to:', quantity),
        error: (err) => console.error('Failed to update cart quantity', err)
      });
    }
  }

  getTotalBill() {
    let getTotal = 0;
    this.orderDetails.orderProductQuantityList.forEach(
      (productQuantity) => {
        const price = this.productDetails.filter(
          product => product.productId === productQuantity.productId)[0].price;
        const productTotal = price * productQuantity.quantity;
        getTotal += productTotal;
      }
    );
    return getTotal;
  }

  getQuantityOptions(max: number): number[] {
    return Array.from({ length: max }, (_, i) => i + 1);
  }

  getOrderQuantityReference(productId: number | string) {
    return this.orderDetails.orderProductQuantityList.find(p => p.productId === productId);
  }
  


}
