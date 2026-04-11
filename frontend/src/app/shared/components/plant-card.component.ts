import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Plant } from '../../core/types/models';
import { AssetUrlPipe } from '../pipes/asset-url.pipe';

@Component({
  selector: 'app-plant-card',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, AssetUrlPipe],
  template: `
    <article class="group surface-card overflow-hidden">
      <div class="relative overflow-hidden">
        <img
          [src]="plant.imageUrl | assetUrl"
          [alt]="plant.name"
          class="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span class="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-moss">
          {{ plant.category }}
        </span>
        <button
          *ngIf="showWishlist"
          type="button"
          class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-lg transition hover:scale-105"
          (click)="toggleWishlist.emit(plant.id)"
        >
          {{ wishlisted ? '♥' : '♡' }}
        </button>
      </div>

      <div class="space-y-4 p-5">
        <div class="flex items-start justify-between gap-4">
          <div>
            <a [routerLink]="['/plants', plant.id]" class="font-serif text-3xl text-moss hover:text-fern">
              {{ plant.name }}
            </a>
            <p class="mt-1 text-sm text-slate-500">{{ plant.stock > 0 ? plant.stock + ' in stock' : 'Out of stock' }}</p>
          </div>
          <p class="text-lg font-semibold text-bark">{{ plant.price | currency: 'INR':'symbol':'1.0-0' }}</p>
        </div>

        <p class="line-clamp-3 text-sm leading-6 text-slate-600">{{ plant.description }}</p>

        <div *ngIf="!showAdminActions" class="flex items-center gap-3">
          <button type="button" class="btn-primary flex-1" [disabled]="plant.stock === 0" (click)="addToCart.emit(plant.id)">
            {{ plant.stock === 0 ? 'Out of stock' : 'Add to cart' }}
          </button>
          <a [routerLink]="['/plants', plant.id]" class="btn-secondary">Details</a>
        </div>

        <div *ngIf="showAdminActions" class="flex items-center gap-3">
          <a [routerLink]="['/admin/plants', plant.id, 'edit']" class="btn-secondary flex-1">Edit</a>
          <button type="button" class="btn-primary flex-1 !bg-clay hover:!bg-clay/90" (click)="archive.emit(plant.id)">
            Archive
          </button>
        </div>
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlantCardComponent {
  @Input({ required: true }) plant!: Plant;
  @Input() wishlisted = false;
  @Input() showWishlist = true;
  @Input() showAdminActions = false;
  @Output() addToCart = new EventEmitter<number>();
  @Output() toggleWishlist = new EventEmitter<number>();
  @Output() archive = new EventEmitter<number>();
}
