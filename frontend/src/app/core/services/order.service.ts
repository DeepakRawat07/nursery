import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, CheckoutPayload, Order, PaginatedResponse } from '../types/models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);

  checkout(payload: CheckoutPayload) {
    return this.http
      .post<ApiResponse<Order>>(`${environment.apiBaseUrl}/orders/checkout`, payload)
      .pipe(map((response) => response.data));
  }

  getMyOrders(page = 1, limit = 10) {
    return this.http
      .get<ApiResponse<PaginatedResponse<Order>>>(`${environment.apiBaseUrl}/orders`, {
        params: new HttpParams().set('page', String(page)).set('limit', String(limit))
      })
      .pipe(map((response) => response.data));
  }

  getOrderById(orderId: number) {
    return this.http
      .get<ApiResponse<Order>>(`${environment.apiBaseUrl}/orders/${orderId}`)
      .pipe(map((response) => response.data));
  }
}
