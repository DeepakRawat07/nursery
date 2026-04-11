import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, Wishlist } from '../types/models';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly wishlistState = signal<Wishlist | null>(null);

  readonly wishlist = this.wishlistState.asReadonly();
  readonly itemCount = computed(() => this.wishlistState()?.itemCount ?? 0);

  loadWishlist(): Observable<Wishlist | null> {
    if (!this.auth.isAuthenticated()) {
      this.clear();
      return of(null);
    }

    return this.http.get<ApiResponse<Wishlist>>(`${environment.apiBaseUrl}/wishlist`).pipe(
      map((response) => response.data),
      tap((wishlist) => this.wishlistState.set(wishlist))
    );
  }

  add(plantId: number) {
    return this.http
      .post<ApiResponse<Wishlist>>(`${environment.apiBaseUrl}/wishlist/items`, { plantId })
      .pipe(
        map((response) => response.data),
        tap((wishlist) => this.wishlistState.set(wishlist))
      );
  }

  remove(plantId: number) {
    return this.http
      .delete<ApiResponse<Wishlist>>(`${environment.apiBaseUrl}/wishlist/items/${plantId}`)
      .pipe(
        map((response) => response.data),
        tap((wishlist) => this.wishlistState.set(wishlist))
      );
  }

  has(plantId: number) {
    return !!this.wishlistState()?.items.some((item) => item.id === plantId);
  }

  clear() {
    this.wishlistState.set(null);
  }
}
