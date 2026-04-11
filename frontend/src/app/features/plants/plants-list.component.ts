import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { PlantService } from '../../core/services/plant.service';
import { ToastService } from '../../core/services/toast.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { PaginatedResponse, Plant, PlantFilters } from '../../core/types/models';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { PaginationComponent } from '../../shared/components/pagination.component';
import { PlantCardComponent } from '../../shared/components/plant-card.component';
import { SearchFiltersComponent } from '../../shared/components/search-filters.component';

@Component({
  selector: 'app-plants-list',
  standalone: true,
  imports: [
    CommonModule,
    SearchFiltersComponent,
    PlantCardComponent,
    PaginationComponent,
    EmptyStateComponent
  ],
  template: `
    <section class="mb-10 flex flex-col gap-4 rounded-[2.5rem] bg-white/75 p-8 shadow-soft lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-clay">Plant catalog</p>
        <h1 class="font-serif text-6xl text-moss">Find your next room reset.</h1>
      </div>
      <p class="max-w-2xl text-sm leading-7 text-slate-600">
        Browse by category, price, availability, and search term. Every listing includes stock,
        rich descriptions, wishlist support, and fast add-to-cart actions.
      </p>
    </section>

    <app-search-filters [filters]="filters" (filtersChange)="applyFilters($event)" />

    <section class="mt-8">
      <div class="mb-6 flex items-center justify-between gap-4">
        <p class="text-sm text-slate-600">
          Showing <span class="font-semibold text-moss">{{ plantsPage?.totalItems ?? 0 }}</span> plants
        </p>
      </div>

      <div *ngIf="plantsPage?.items?.length; else emptyState" class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <app-plant-card
          *ngFor="let plant of plantsPage?.items"
          [plant]="plant"
          [wishlisted]="wishlistService.has(plant.id)"
          (addToCart)="onAddToCart($event)"
          (toggleWishlist)="onToggleWishlist($event)"
        />
      </div>

      <ng-template #emptyState>
        <app-empty-state
          title="No plants match these filters"
          message="Try broadening your search, removing price limits, or switching categories."
          actionLabel="Reset filters"
          actionLink="/plants"
        />
      </ng-template>

      <div class="mt-10">
        <app-pagination
          [currentPage]="plantsPage?.page ?? 1"
          [totalPages]="plantsPage?.totalPages ?? 1"
          (pageChange)="changePage($event)"
        />
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlantsListComponent {
  private readonly plantService = inject(PlantService);
  private readonly cartService = inject(CartService);
  readonly wishlistService = inject(WishlistService);
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  filters: PlantFilters = {
    page: 1,
    limit: 9,
    sort: 'newest'
  };
  plantsPage: PaginatedResponse<Plant> | null = null;

  constructor() {
    this.loadPlants();
  }

  applyFilters(filters: PlantFilters) {
    this.filters = {
      ...this.filters,
      ...filters,
      page: 1
    };
    this.loadPlants();
  }

  changePage(page: number) {
    this.filters = {
      ...this.filters,
      page
    };
    this.loadPlants();
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

  private loadPlants() {
    this.plantService.getPlants(this.filters).subscribe((page) => {
      this.plantsPage = page;
      this.changeDetectorRef.markForCheck();
    });
  }
}
