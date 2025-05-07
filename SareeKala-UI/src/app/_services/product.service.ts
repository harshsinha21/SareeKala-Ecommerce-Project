import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../_model/product.model';
import { OrderDetails } from '../_model/order-detais.model';
import { Observable } from 'rxjs';
import { ProductCheckoutDTO } from '../_model/product-checkout-dto.model';
import { OrderHistory } from '../_model/order-history.model';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient: HttpClient) { }

  public markAsDelivered(orderId: number) {
    return this.httpClient.get("http://localhost:9090/updateOrderStatus/" + orderId);
  }

  public getAllOrders(status: string): Observable<OrderHistory[]> {
    return this.httpClient.get<OrderHistory[]>("http://localhost:9090/getAllOrderDetails/" + status);
  }

  public getMyOrders(): Observable<OrderHistory[]> {
    return this.httpClient.get<OrderHistory[]>("http://localhost:9090/getOrderDetails");
  }

  public addProduct(product: FormData) {
    return this.httpClient.post<Product>("http://localhost:9090/addNewProduct", product);
  }

  public getAllProducts(pagenumber: number, searchKey: string = "") {
    return this.httpClient.get<Product[]>("http://localhost:9090/getAllProducts?pagenumber=" + pagenumber + "&searchKey=" + searchKey);
  }

  public getProductById(productId: string) {
    return this.httpClient.get<Product>("http://localhost:9090/getProductById/" + productId);
  }

  public deleteProduct(productId: number) {
    return this.httpClient.delete("http://localhost:9090/deleteProduct/" + productId);
  }

  public getProductDetails(isSingleProductCheckout: boolean, productId: any): Observable<ProductCheckoutDTO[]> {
    return this.httpClient.get<ProductCheckoutDTO[]>(
      `http://localhost:9090/getProductDetails/${isSingleProductCheckout}/${productId}`
    );
    
  }

  public placeOrder(orderDetails: OrderDetails, isCartCheckout: any){
    return this.httpClient.post("http://localhost:9090/placeOrder/" + isCartCheckout, orderDetails);
  }

  public addToCart(productId: number) {
    return this.httpClient.get("http://localhost:9090/addToCart/" + productId);
  }

  public getCartDetails() {
    return this.httpClient.get("http://localhost:9090/getCartDetails");
  }

  public deleteCartItem(cartId: number) {
    return this.httpClient.delete("http://localhost:9090/deleteCartItem/" + cartId);
  }

  public updateCartItemQuantity(cartItemId: number, quantity: number) {
    return this.httpClient.put(
      `http://localhost:9090/item/${cartItemId}?quantity=${quantity}`,
      {}
    );
  }
  
  
}
