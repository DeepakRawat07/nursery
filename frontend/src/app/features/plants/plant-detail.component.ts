import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { PlantService } from '../../core/services/plant.service';
import { ToastService } from '../../core/services/toast.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { Plant } from '../../core/types/models';
import { AssetUrlPipe } from '../../shared/pipes/asset-url.pipe';

@Component({
  selector: 'app-plant-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, AssetUrlPipe],
  template: `
    <section *ngIf="plant" class="grid gap-8 lg:grid-cols-[1fr,0.9fr]">
      <div class="surface-card overflow-hidden">
        <img [src]="plant.imageUrl | assetUrl" [alt]="plant.name" class="h-full min-h-[420px] w-full object-cover" />
      </div>

      <div class="surface-card p-8">
        <div class="flex flex-wrap items-center gap-3">
          <span class="rounded-full bg-sage/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-moss">
            {{ plant.category }}
          </span>
          <span
            class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]"
            [class.bg-emerald-100]="plant.stock > 0"
            [class.text-emerald-800]="plant.stock > 0"
            [class.bg-rose-100]="plant.stock === 0"
            [class.text-rose-800]="plant.stock === 0"
          >
            {{ plant.stock > 0 ? plant.stock + ' available' : 'Currently sold out' }}
          </span>
        </div>

        <h1 class="mt-5 font-serif text-6xl text-moss">{{ plant.name }}</h1>
        <p class="mt-4 text-2xl font-semibold text-bark">{{ plant.price | currency: 'INR':'symbol':'1.0-0' }}</p>
        <p class="mt-6 text-base leading-8 text-slate-600">{{ plant.description }}</p>

        <div class="mt-8 grid gap-3 sm:grid-cols-2">
          <button type="button" class="btn-primary" [disabled]="plant.stock === 0" (click)="addToCart()">
            {{ plant.stock === 0 ? 'Out of stock' : 'Add to cart' }}
          </button>
          <button type="button" class="btn-secondary" (click)="toggleWishlist()">
            {{ wishlistService.has(plant.id) ? 'Remove from wishlist' : 'Save to wishlist' }}
          </button>
        </div>

        <div class="mt-8 grid gap-4 rounded-3xl bg-seed p-5 sm:grid-cols-3">
          <div>
            <p class="text-xs uppercase tracking-[0.24em] text-slate-500">Best for</p>
            <p class="mt-2 text-sm font-semibold text-moss">Modern homes</p>
          </div>
          <div>
            <p class="text-xs uppercase tracking-[0.24em] text-slate-500">Care level</p>
            <p class="mt-2 text-sm font-semibold text-moss">Beginner friendly</p>
          </div>
          <div>
            <p class="text-xs uppercase tracking-[0.24em] text-slate-500">Dispatch</p>
            <p class="mt-2 text-sm font-semibold text-moss">Within 48 hours</p>
          </div>
        </div>

        <a routerLink="/plants" class="mt-8 inline-flex text-sm font-semibold text-moss hover:text-fern">
          Back to catalog
        </a>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlantDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly plantService = inject(PlantService);
  private readonly cartService = inject(CartService);
  readonly wishlistService = inject(WishlistService);
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  plant: Plant | null = null;

  constructor() {
    const plantId = Number(this.route.snapshot.paramMap.get('plantId'));

    this.plantService.getPlantById(plantId).subscribe((plant) => {
      this.plant = plant;
      this.changeDetectorRef.markForCheck();
    });
  }

  addToCart() {
    if (!this.plant) {
      return;
    }

    if (!this.authService.isAuthenticated()) {
      this.toastService.info('Login to add plants to your cart.');
      this.router.navigateByUrl('/login');
      return;
    }

    this.cartService.addItem(this.plant.id).subscribe(() => {
      this.toastService.success('Plant added to cart.');
    });
  }

  toggleWishlist() {
    if (!this.plant) {
      return;
    }

    if (!this.authService.isAuthenticated()) {
      this.toastService.info('Login to save plants to your wishlist.');
      this.router.navigateByUrl('/login');
      return;
    }

    const removing = this.wishlistService.has(this.plant.id);
    const request = removing
      ? this.wishlistService.remove(this.plant.id)
      : this.wishlistService.add(this.plant.id);

    request.subscribe(() => {
      this.toastService.success(removing ? 'Removed from wishlist.' : 'Added to wishlist.');
    });
  }
}
