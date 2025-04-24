import { Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { ProductService } from '../_services/product.service';
import { Product } from '../_model/product.model';
import { ImageProcessorService } from '../image-processor.service';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [MatGridListModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  productDetails: Product[] = [];

  constructor(
    private productService: ProductService,
    private imageProcessingService: ImageProcessorService
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

}
