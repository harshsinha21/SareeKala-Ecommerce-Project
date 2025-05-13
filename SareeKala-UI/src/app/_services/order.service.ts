import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { OrderDetails } from '../_model/order-details.model'; // adjust path if needed
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = `${environment.apiUrl}/order`; // adjust to match backend route

  constructor(private http: HttpClient,  private route: ActivatedRoute,
    private orderService: OrderService) {}

  getOrderBySessionId(sessionId: string): Observable<OrderDetails> {
    return this.http.get<OrderDetails>(`${this.baseUrl}/session/${sessionId}`);
  }
}
