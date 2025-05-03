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
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SearchService } from '../_services/search.service';

@Component({
  selector: 'app-home',
  imports: [MatGridListModule, MatInputModule, CommonModule, MatIconModule, MatButtonModule, MatFormFieldModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  searchQuery: string = '';
  allProducts: Product[] = []; 

  pagenumber: number = 0;

  showLoadButton = false;

  productDetails: Product[] = [];

  constructor(
    private productService: ProductService,
    private imageProcessingService: ImageProcessorService,
    private router: Router,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
    this.searchService.searchQuery$.subscribe((query: string) => {
      this.pagenumber = 0;
      this.searchQuery = query;
      this.getAllProducts(this.searchQuery);
    });
  }

  // filterProducts() {
  //   const query = this.searchQuery.toLowerCase().trim();
  //   if (query === '') {
  //     this.productDetails = this.allProducts;
  //   } else {
  //     this.productDetails = this.allProducts.filter(product =>
  //       product.productName.toLowerCase().includes(query)
  //     );
  //   }
  // }

  // public getAllProducts() {
  //   this.productService.getAllProducts(this.pagenumber)
  //   .pipe(map((x: Product[], i) => x.map((product: Product) => this.imageProcessingService.createImages(product))))
  //   .subscribe(
  //     (response: Product[]) => {
  //       console.log(response);
  //       if(response.length == 16) {
  //         this.showLoadButton = true;
  //       } else {
  //         this.showLoadButton = false;
  //       }
  //       response.forEach(p => this.productDetails.push(p));
  //     },
  //     (error: HttpErrorResponse) => {
  //       console.log(error);
  //     }
  //   )
  // }


  filterProducts() {
    const query = this.searchQuery.toLowerCase().trim();
    if (query === '') {
      this.productDetails = [...this.allProducts];
    } else {
      this.productDetails = this.allProducts.filter(product =>
        product.productName.toLowerCase().includes(query)
      );
    }
  }

  public getAllProducts(searchKey: string = '') {
    this.productService.getAllProducts(this.pagenumber, searchKey)
      .pipe(map((x: Product[], i) => x.map((product: Product) => this.imageProcessingService.createImages(product))))
      .subscribe(
        (response: Product[]) => {
          console.log(response);
          if(response.length == 16) {
            this.showLoadButton = true;
          } else {
            this.showLoadButton = false;
          }
          // Only reset productDetails if it's a new search (page 0)
          if (this.pagenumber === 0) {
            this.productDetails = [];
          }
          response.forEach(p => this.productDetails.push(p));
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      );
  }
  

  showProductDetails(productId: any) {
    this.router.navigate(['/viewDetails', {productId: productId}]);
  }

  public loadMore() {
    this.pagenumber = this.pagenumber + 1;
    this.getAllProducts(this.searchQuery);
  }





}
