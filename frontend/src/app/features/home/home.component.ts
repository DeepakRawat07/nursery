import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { PlantService } from '../../core/services/plant.service';
import { ToastService } from '../../core/services/toast.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { Plant } from '../../core/types/models';
import { PlantCardComponent } from '../../shared/components/plant-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, PlantCardComponent],
  template: `
    <section class="rounded-[2.5rem] bg-hero-texture px-8 py-14 shadow-soft sm:px-12">
      <div class="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.34em] text-moss/70">Curated for modern spaces</p>
          <h1 class="mt-6 max-w-3xl font-serif text-6xl leading-none text-moss sm:text-7xl">
            Plants that soften rooms and sharpen moods.
          </h1>
          <p class="mt-6 max-w-2xl text-base leading-8 text-slate-600">
            Explore a premium nursery storefront with fast browsing, clean checkout, wishlist saves,
            and an admin suite for catalog and order management.
          </p>
          <div class="mt-8 flex flex-wrap gap-4">
            <a routerLink="/plants" class="btn-primary">Shop plants</a>
            <a routerLink="/register" class="btn-secondary">Create account</a>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="surface-card p-6">
            <p class="text-sm uppercase tracking-[0.22em] text-slate-500">Indoor calm</p>
            <p class="mt-3 font-serif text-4xl text-moss">Air-purifying</p>
            <p class="mt-3 text-sm leading-6 text-slate-600">Bedroom-safe foliage and low-maintenance statement plants.</p>
          </div>
          <div class="surface-card p-6 sm:translate-y-8">
            <p class="text-sm uppercase tracking-[0.22em] text-slate-500">Outdoor ritual</p>
            <p class="mt-3 font-serif text-4xl text-moss">Sunny corners</p>
            <p class="mt-3 text-sm leading-6 text-slate-600">Herbs, flowers, and patio growers with healthy stock visibility.</p>
          </div>
          <div class="surface-card p-6">
            <p class="text-sm uppercase tracking-[0.22em] text-slate-500">Medicinal roots</p>
            <p class="mt-3 font-serif text-4xl text-moss">Everyday wellness</p>
            <p class="mt-3 text-sm leading-6 text-slate-600">Traditional household plants with clear descriptions and pricing.</p>
          </div>
          <div class="surface-card p-6 sm:translate-y-8">
            <p class="text-sm uppercase tracking-[0.22em] text-slate-500">Admin control</p>
            <p class="mt-3 font-serif text-4xl text-moss">Catalog + orders</p>
            <p class="mt-3 text-sm leading-6 text-slate-600">Manage stock, uploads, analytics, users, and order fulfillment.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-14">
      <div class="mb-6 flex items-end justify-between gap-4">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-clay">Featured arrivals</p>
          <h2 class="font-serif text-5xl text-moss">Fresh picks this week</h2>
        </div>
        <a routerLink="/plants" class="text-sm font-semibold text-moss hover:text-fern">Browse full collection</a>
      </div>

      <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <app-plant-card
          *ngFor="let plant of featuredPlants"
          [plant]="plant"
          [wishlisted]="wishlistService.has(plant.id)"
          (addToCart)="onAddToCart($event)"
          (toggleWishlist)="onToggleWishlist($event)"
        />
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private readonly plantService = inject(PlantService);
  private readonly cartService = inject(CartService);
  readonly wishlistService = inject(WishlistService);
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  featuredPlants: Plant[] = [];

  constructor() {
    this.plantService.getPlants({ limit: 4, sort: 'newest' }).subscribe((page) => {
      this.featuredPlants = page.items;
      this.changeDetectorRef.markForCheck();
    });
  }

  onAddToCart(plantId: number) {
    if (!this.authService.isAuthenticated()) {
      this.toastService.info('Login to add plants to your cart.');
      this.router.navigateByUrl('/login');
      return;
    }

    this.cartService.addItem(plantId).subscribe(() => {
      this.toastService.success('Plant added to cart.');
    });
  }

  onToggleWishlist(plantId: number) {
    if (!this.authService.isAuthenticated()) {
      this.toastService.info('Login to save plants to your wishlist.');
      this.router.navigateByUrl('/login');
      return;
    }

    const removing = this.wishlistService.has(plantId);
    const request = removing ? this.wishlistService.remove(plantId) : this.wishlistService.add(plantId);

    request.subscribe(() => {
      this.toastService.success(removing ? 'Removed from wishlist.' : 'Added to wishlist.');
    });
  }
}
