import { Component, OnInit } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { Product } from '../_model/product.model';
import { ProductService } from '../_services/product.service';
import { HttpErrorResponse } from '@angular/common/http';

import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ShowProductImagesComponent } from '../show-product-images/show-product-images.component';
import { ImageProcessorService } from '../image-processor.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


@Component({
  selector: 'app-show-product',
  imports: [CommonModule, MatTableModule,
       MatCardModule, MatButtonModule, MatGridListModule, MatIconModule],
  templateUrl: './show-product.component.html',
  styleUrl: './show-product.component.css'
})
export class ShowProductComponent implements OnInit {

    productDetails: Product[] = [];
    displayedColumns: string[] = ['Id', 'Product Name', 'Description', 'Price', 'Discounted Price', 'Images', 'Edit', 'Delete'];
    constructor(private productService: ProductService, 
      public imagesDialog: MatDialog,
      private imageProcessorService: ImageProcessorService,
      private router: Router
    ) {}


    ngOnInit(): void {
      this.getAllProducts();
        
    }

    public getAllProducts() {
      this.productService.getAllProducts()
      .pipe(map((x: Product[], i) => 
        x.map((product: Product) => 
          this.imageProcessorService.createImages(product))))
      .subscribe(
        (response: Product[]) => {
          console.log(response);
          this.productDetails = response;
        }, (error: HttpErrorResponse) => {
          console.log(error);
        }
      );
    }

    deleteProduct(productId: number) {
        this.productService.deleteProduct(productId).subscribe(
          (response) => {
            this.getAllProducts();
          }, (error: HttpErrorResponse) => {
            console.log(error);
          }
        )
    }


    showImages(product: Product) {
        this.imagesDialog.open(ShowProductImagesComponent, {
          data: {
            images: product.productImages
          },
          height: '325px',
          width: '800px'
        });
    }

    editProduct(productId: number) {
      this.router.navigate(['/addProduct', {productId: productId}]);
    }

}
