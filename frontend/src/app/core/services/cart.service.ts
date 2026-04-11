import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, Cart } from '../types/models';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly cartState = signal<Cart | null>(null);

  readonly cart = this.cartState.asReadonly();
  readonly itemCount = computed(() => this.cartState()?.itemCount ?? 0);
  readonly totalPrice = computed(() => this.cartState()?.totalPrice ?? 0);

  loadCart(): Observable<Cart | null> {
    if (!this.auth.isAuthenticated()) {
      this.clear();
      return of(null);
    }

    return this.http.get<ApiResponse<Cart>>(`${environment.apiBaseUrl}/cart`).pipe(
      map((response) => response.data),
      tap((cart) => this.cartState.set(cart))
    );
  }

  addItem(plantId: number, quantity = 1) {
    return this.http
      .post<ApiResponse<Cart>>(`${environment.apiBaseUrl}/cart/items`, {
        plantId,
        quantity
      })
      .pipe(
        map((response) => response.data),
        tap((cart) => this.cartState.set(cart))
      );
  }

  updateItem(itemId: number, quantity: number) {
    return this.http
      .patch<ApiResponse<Cart>>(`${environment.apiBaseUrl}/cart/items/${itemId}`, {
        quantity
      })
      .pipe(
        map((response) => response.data),
        tap((cart) => this.cartState.set(cart))
      );
  }

  removeItem(itemId: number) {
    return this.http
      .delete<ApiResponse<Cart>>(`${environment.apiBaseUrl}/cart/items/${itemId}`)
      .pipe(
        map((response) => response.data),
        tap((cart) => this.cartState.set(cart))
      );
  }

  clear() {
    this.cartState.set(null);
  }
}
