import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTable, MatTableModule } from '@angular/material/table';
import { ProductService } from '../_services/product.service';
import { Router } from '@angular/router';
import { MatCard } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, MatButtonModule, MatTableModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  displayedColumns: string[] = ['Name', 'Description', 'Price', 'Quantity', 'Action'];

  cartDetails: any[] = [];

  constructor(private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCartDetails();

  }


  getCartDetails() {
    this.productService.getCartDetails().subscribe(
      (response: any) => {
        console.log(response);
        if (response && response.length > 0) {
          this.cartDetails = response[0].items;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // onQuantityChange(item: any) {
  //   console.log(`Updated quantity for item ${item.id}: ${item.quantity}`);
  //   // Optional: send update to backend if needed
  // }
  

  delete(cartId: number) {
    console.log(cartId);
    this.productService.deleteCartItem(cartId).subscribe(
      (resp) => {
        console.log(resp);
        this.getCartDetails();
      }, (err) => {
        console.log(err);
      }
    );
  }

  checkout() {

    this.router.navigate(['/buyProduct', {
      isSingleProductCheckout: false, id: 0
    }]);
  }

  onQuantityChange(item: any) {
    this.productService.updateCartItemQuantity(item.id, item.quantity).subscribe({
      next: (response) => {
        console.log('Quantity updated:', response);
      },
      error: (err) => {
        console.error('Error updating quantity', err);
      }
    });
  }
  

  getQuantityOptions(max: number): number[] {
    return Array.from({ length: max }, (_, i) => i + 1);
  }
  
  
}
