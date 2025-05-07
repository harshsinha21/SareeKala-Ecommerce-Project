import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from '../_model/product.model';
import { CommonModule } from '@angular/common';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { ProductService } from '../_services/product.service';

@Component({
  selector: 'app-view-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MatGridTile, MatGridList],
  templateUrl: './view-details.component.html',
  styleUrl: './view-details.component.css'
})
export class ViewDetailsComponent implements OnInit {

  product: Product = {
    productId: null,
    productName: "",
    productDesc: "",
    productPrice: 0,
    productDiscountedPrice: 0,
    quantity: 0,
    productImages: []
  }

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.product = this.activatedRoute.snapshot.data['product'];
    console.log(this.product);
  }

  buyProduct(productId: any) {

    console.log("Navigating with params:", {
      isSingleProductCheckout: true,
      id: productId
    });
    this.router.navigate(['/buyProduct', { isSingleProductCheckout: true, id: productId }]);
  }

  addToCart(productId: any) {
    const token = localStorage.getItem('token'); // or sessionStorage
    const headers = {
      Authorization: `Bearer ${token}`
    };
    this.productService.addToCart(productId).subscribe(
      (reponse) => {
        console.log(reponse);
      },
      (error) => {
        console.log(error);
      }
    )
  }

}
