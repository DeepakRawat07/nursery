import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlantFilters } from '../../core/types/models';

@Component({
  selector: 'app-search-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="surface-card p-5">
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <input [(ngModel)]="draft.q" type="search" class="field xl:col-span-2" placeholder="Search by name or category" />

        <select [(ngModel)]="draft.category" class="field">
          <option value="">All categories</option>
          <option value="Indoor">Indoor</option>
          <option value="Outdoor">Outdoor</option>
          <option value="Medicinal">Medicinal</option>
        </select>

        <input [(ngModel)]="draft.minPrice" type="number" min="0" class="field" placeholder="Min price" />
        <input [(ngModel)]="draft.maxPrice" type="number" min="0" class="field" placeholder="Max price" />

        <select [(ngModel)]="draft.sort" class="field">
          <option value="newest">Newest</option>
          <option value="priceAsc">Price: Low to high</option>
          <option value="priceDesc">Price: High to low</option>
          <option value="nameAsc">Name: A-Z</option>
          <option value="stockDesc">Most stocked</option>
        </select>
      </div>

      <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
        <label class="inline-flex items-center gap-2 text-sm text-slate-600">
          <input [(ngModel)]="draft.inStock" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-moss focus:ring-moss/30" />
          In stock only
        </label>

        <div class="flex gap-3">
          <button type="button" class="btn-secondary" (click)="resetFilters()">Reset</button>
          <button type="button" class="btn-primary" (click)="applyFilters()">Apply filters</button>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFiltersComponent {
  @Input() set filters(value: PlantFilters) {
    this.draft = {
      q: value.q ?? '',
      category: value.category ?? '',
      minPrice: value.minPrice ?? null,
      maxPrice: value.maxPrice ?? null,
      inStock: value.inStock ?? false,
      sort: value.sort ?? 'newest'
    };
  }

  @Output() filtersChange = new EventEmitter<PlantFilters>();

  draft: PlantFilters = {
    q: '',
    category: '',
    minPrice: null,
    maxPrice: null,
    inStock: false,
    sort: 'newest'
  };

  applyFilters() {
    this.filtersChange.emit({
      q: this.draft.q?.trim() || undefined,
      category: this.draft.category || undefined,
      minPrice: this.draft.minPrice || undefined,
      maxPrice: this.draft.maxPrice || undefined,
      inStock: this.draft.inStock || undefined,
      sort: this.draft.sort || 'newest',
      page: 1
    });
  }

  resetFilters() {
    this.draft = {
      q: '',
      category: '',
      minPrice: null,
      maxPrice: null,
      inStock: false,
      sort: 'newest'
    };
    this.applyFilters();
  }
}
