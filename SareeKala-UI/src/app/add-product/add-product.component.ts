import { Component, Directive, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Product } from '../_model/product.model';
import { ProductService } from '../_services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FileHandle } from '../_model/file-handle.model';
import { DomSanitizer } from '@angular/platform-browser';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { DragDirective } from '../drag.directive';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-add-product',
  imports: [CommonModule, FormsModule, MatFormFieldModule,
    MatInputModule, MatCardModule, MatButtonModule, MatGridListModule, DragDirective],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit {
  isNewProduct = true;

  product: Product = {
    productId: null,
    productName: "",
    productDesc: "",
    productPrice: 0,
    productDiscountedPrice: 0,
    quantity: 0,
    productImages: []
  }

  constructor(
    private productService: ProductService, 
    private sanitizer: DomSanitizer,
    private activateRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.product = this.activateRoute.snapshot.data['product'];

    if(this.product && this.product.productId) {
        this.isNewProduct = false;
    }
  }

  addProduct(productForm: NgForm) {

    const productFormData = this.prepareFormData(this.product);

    this.productService.addProduct(productFormData).subscribe(
      (response: Product) => {
        productForm.reset();
        this.product.productImages = [];
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  prepareFormData(product: Product): FormData {
    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(product)], {type: 'application/json'}));
    
    for(var i = 0; i < product.productImages.length; i++)
    {
      formData.append('imageFile', product.productImages[i].file, product.productImages[i].file.name);
    }

    return formData;
  }

  onFileSelected(event: any) {
    if(event.target.files) {
      const file = event.target.files[0];

      const fileHandle: FileHandle = {
        file: file,
        url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file))
      }
      this.product.productImages.push(fileHandle);
    }
    
  }

  removeImage(i: number) {
    this.product.productImages.splice(i, 1);
  }

  fileDropped(fileHandle: FileHandle) {
    this.product.productImages.push(fileHandle);
  }

}
