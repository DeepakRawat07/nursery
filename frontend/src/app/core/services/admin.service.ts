import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Analytics, ApiResponse, Order, PaginatedResponse, User } from '../types/models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);

  getAnalytics() {
    return this.http
      .get<ApiResponse<Analytics>>(`${environment.apiBaseUrl}/admin/analytics`)
      .pipe(map((response) => response.data));
  }

  getOrders(page = 1, limit = 10, status = '', q = '') {
    let params = new HttpParams().set('page', String(page)).set('limit', String(limit));

    if (status) {
      params = params.set('status', status);
    }

    if (q) {
      params = params.set('q', q);
    }

    return this.http
      .get<ApiResponse<PaginatedResponse<Order>>>(`${environment.apiBaseUrl}/admin/orders`, {
        params
      })
      .pipe(map((response) => response.data));
  }

  updateOrderStatus(orderId: number, status: Order['status']) {
    return this.http
      .patch<ApiResponse<Order>>(`${environment.apiBaseUrl}/admin/orders/${orderId}/status`, {
        status
      })
      .pipe(map((response) => response.data));
  }

  getUsers(page = 1, limit = 10) {
    return this.http
      .get<ApiResponse<PaginatedResponse<User>>>(`${environment.apiBaseUrl}/admin/users`, {
        params: new HttpParams().set('page', String(page)).set('limit', String(limit))
      })
      .pipe(map((response) => response.data));
  }
}
