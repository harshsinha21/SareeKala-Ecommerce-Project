import { Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { ProductService } from '../_services/product.service';
import { Product } from '../_model/product.model';
import { ImageProcessorService } from '../image-processor.service';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [MatGridListModule, CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  productDetails: Product[] = [];

  constructor(
    private productService: ProductService,
    private imageProcessingService: ImageProcessorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  public getAllProducts() {
    this.productService.getAllProducts()
    .pipe(map((x: Product[], i) => x.map((product: Product) => this.imageProcessingService.createImages(product))))
    .subscribe(
      (response: Product[]) => {
        console.log(response);
        this.productDetails = response;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    )
  }

  showProductDetails(productId: any) {
    this.router.navigate(['/viewDetails', {productId: productId}]);
  }

}
