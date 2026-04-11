import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlantService } from '../../core/services/plant.service';
import { ToastService } from '../../core/services/toast.service';
import { PaginatedResponse, Plant } from '../../core/types/models';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { PaginationComponent } from '../../shared/components/pagination.component';
import { PlantCardComponent } from '../../shared/components/plant-card.component';

@Component({
  selector: 'app-admin-plants',
  standalone: true,
  imports: [CommonModule, RouterLink, PlantCardComponent, PaginationComponent, EmptyStateComponent],
  template: `
    <section class="mb-10 flex flex-col gap-4 rounded-[2.5rem] bg-white/75 p-8 shadow-soft lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-clay">Catalog management</p>
        <h1 class="font-serif text-6xl text-moss">Plants and inventory.</h1>
      </div>
      <a routerLink="/admin/plants/new" class="btn-primary">Add new plant</a>
    </section>

    <ng-container *ngIf="plantsPage?.items?.length; else emptyState">
      <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div *ngFor="let plant of plantsPage?.items" class="space-y-3">
          <app-plant-card [plant]="plant" [showWishlist]="false" [showAdminActions]="true" (archive)="archivePlant($event)" />
          <p *ngIf="!plant.isActive" class="text-sm font-semibold text-rose-600">Archived</p>
        </div>
      </div>

      <div class="mt-10">
        <app-pagination
          [currentPage]="plantsPage?.page ?? 1"
          [totalPages]="plantsPage?.totalPages ?? 1"
          (pageChange)="loadPlants($event)"
        />
      </div>
    </ng-container>

    <ng-template #emptyState>
      <app-empty-state
        title="No plants in the catalog"
        message="Start by creating your first plant listing with an image, description, category, and stock."
        actionLabel="Add a plant"
        actionLink="/admin/plants/new"
      />
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminPlantsComponent {
  private readonly plantService = inject(PlantService);
  private readonly toastService = inject(ToastService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  plantsPage: PaginatedResponse<Plant> | null = null;

  constructor() {
    this.loadPlants();
  }

  loadPlants(page = 1) {
    this.plantService.getAdminPlants({ page, limit: 9, sort: 'newest' }).subscribe((plantsPage) => {
      this.plantsPage = plantsPage;
      this.changeDetectorRef.markForCheck();
    });
  }

  archivePlant(plantId: number) {
    this.plantService.deletePlant(plantId).subscribe(() => {
      this.toastService.success('Plant archived successfully.');
      this.loadPlants(this.plantsPage?.page ?? 1);
    });
  }
}
