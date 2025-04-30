import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot } from '@angular/router';
import { Product } from './_model/product.model';
import { ProductService } from './_services/product.service';
import { map, Observable } from 'rxjs';
import { ImageProcessorService } from './image-processor.service';

@Injectable({
  providedIn: 'root'
})
export class BuyProductResolverService implements Resolve<Product[]>{

  constructor(private productService: ProductService,
    private imageProcessingService: ImageProcessorService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Product[] | Observable<Product[]> | Promise<Product[]> {
    const id = route.paramMap.get("id");
    const isSingleProductCheckout = route.paramMap.get("isSingleProductCheckout") == 'true';
    return this.productService.getProductDetails(isSingleProductCheckout, id)
      .pipe(map((x: Product[], i) => x.map((product: Product) => this.imageProcessingService.createImages(product))));
  }
}
