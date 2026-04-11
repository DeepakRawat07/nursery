import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { PlantCardComponent } from '../../shared/components/plant-card.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, PlantCardComponent, EmptyStateComponent],
  template: `
    <section class="mb-10">
      <p class="text-sm font-semibold uppercase tracking-[0.3em] text-clay">Wishlist</p>
      <h1 class="font-serif text-6xl text-moss">Saved for later.</h1>
    </section>

    <ng-container *ngIf="wishlistService.wishlist()?.items?.length; else emptyWishlist">
      <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <app-plant-card
          *ngFor="let plant of wishlistService.wishlist()?.items"
          [plant]="plant"
          [wishlisted]="true"
          (addToCart)="addToCart($event)"
          (toggleWishlist)="removeFromWishlist($event)"
        />
      </div>
    </ng-container>

    <ng-template #emptyWishlist>
      <app-empty-state
        title="Your wishlist is clear"
        message="Save plants you love so you can come back when the timing is right."
        actionLabel="Browse plants"
        actionLink="/plants"
      />
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WishlistComponent {
  readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);
  private readonly toastService = inject(ToastService);

  constructor() {
    this.wishlistService.loadWishlist().subscribe();
  }

  addToCart(plantId: number) {
    this.cartService.addItem(plantId).subscribe(() => {
      this.toastService.success('Plant added to cart.');
    });
  }

  removeFromWishlist(plantId: number) {
    this.wishlistService.remove(plantId).subscribe(() => {
      this.toastService.success('Removed from wishlist.');
    });
  }
}
