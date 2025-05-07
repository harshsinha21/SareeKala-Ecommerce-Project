import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot } from '@angular/router';
import { Product } from './_model/product.model';
import { ProductService } from './_services/product.service';
import { map, Observable } from 'rxjs';
import { ImageProcessorService } from './image-processor.service';
import { ProductCheckoutDTO } from './_model/product-checkout-dto.model'; 
@Injectable({
  providedIn: 'root'
})


export class BuyProductResolverService implements Resolve<ProductCheckoutDTO[]> {
  constructor(
    private productService: ProductService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProductCheckoutDTO[]> {
    const id = Number(route.paramMap.get("id"));
    const isSingleProductCheckout = route.paramMap.get("isSingleProductCheckout") === 'true';
    return this.productService.getProductDetails(isSingleProductCheckout, id);
  }
}

