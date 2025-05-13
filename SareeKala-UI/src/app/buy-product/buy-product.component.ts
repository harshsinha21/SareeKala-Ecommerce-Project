import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { OrderDetails } from '../_model/order-details.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../_services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { ProductCheckoutDTO } from '../_model/product-checkout-dto.model';
import { environment } from '../../environments/environment';
import { TransactionResponse } from '../_model/transaction-response.model'; 


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

  stripe: any;

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
    const orderDetails: OrderDetails = {
      fullName: this.orderDetails.fullName,
      fullAddress: this.orderDetails.fullAddress,
      contactNumber: this.orderDetails.contactNumber,
      orderProductQuantityList: this.orderDetails.orderProductQuantityList
    };

    if (!this.isAddressInCanada(orderDetails.fullAddress)) {
      alert("Please provide a valid Canadian address.");
      return; // Prevent submission if address is invalid
    }
  
    if (!this.stripe) {
      this.stripe = (window as any).Stripe(environment.stripePublishableKey);
    }
  
    // Create transaction with OrderDetails (no amount needed)
    this.productService.createTransaction(orderDetails).subscribe(
      (response: TransactionResponse) => {
        const sessionId = response.transactionId;
        console.log('Stripe session created. Redirecting...', sessionId);
  
        // Redirect to Stripe Checkout
        this.stripe.redirectToCheckout({ sessionId: sessionId }).then((result: any) => {
          if (result.error) {
            console.error('Stripe Checkout redirect failed:', result.error.message);
          } else {
            // Redirect to success page after successful payment
            this.router.navigate(['/order-success']);
          }
        });
      },
      (error) => {
        console.error('Error creating Stripe transaction:', error);
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
  
  public finalizeOrder() {
    // The value of `isSingleProductCheckout` determines whether it's cart checkout or single product checkout
    const isCartCheckout = this.isSingleProductCheckout; // If false, it's a cart checkout

    // Now pass `isCartCheckout` to placeOrder API
    this.productService.placeOrder(this.orderDetails, isCartCheckout).subscribe(
      (response) => {
        console.log('Order placed successfully:', response);
        this.router.navigate(['/order-success']);
      },
      (error) => {
        console.error('Error placing order:', error);
      }
    );
  }

  public isAddressInCanada(address: string): boolean {
    if (!address) return false;
  
    const lowerAddress = address.toLowerCase();
  
    // Array of Canadian province abbreviations
    const canadianProvinces = ["ab", "bc", "mb", "nb", "nl", "ns", "nt", "on", "pe", "qc", "sk", "yt"];
    for (const province of canadianProvinces) {
      if (lowerAddress.includes(province)) {
        return true;
      }
    }
  
    // Array of common Canadian cities (extend as necessary)
    const canadianCities = ["toronto", "vancouver", "montreal", "calgary", "ottawa", "edmonton", "winnipeg", "halifax"];
    for (const city of canadianCities) {
      if (lowerAddress.includes(city)) {
        return true;
      }
    }
  
    // Simple postal code format check (A1A 1A1)
    const postalCodePattern = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/; // E.g., M5A 1A1
    if (postalCodePattern.test(lowerAddress)) {
      return true;
    }
  
    return false;
  }



}
