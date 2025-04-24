import { Injectable } from '@angular/core';
import { Product } from './_model/product.model';
import { ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductService } from './_services/product.service';
import { ImageProcessorService } from './image-processor.service';

@Injectable({
  providedIn: 'root'
})
export class ProductResolverService implements Resolve<Product> {

  constructor(private productService: ProductService,
    private imageProcessorService: ImageProcessorService
  ) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product> {
    const id = route.paramMap.get("productId");
    if(id) {
      return this.productService.getProductById(id)
      .pipe(map(p => this.imageProcessorService.createImages(p)));
    } else {
      return of(this.getProduct());
    }
    
  }

  getProduct() {
    return {
      productId: null,
      productName: "",
      productDesc: "",
      productPrice: 0,
      productDiscountedPrice: 0,
      productImages: []
    };
  }
}
