import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { Order, PaginatedResponse } from '../../core/types/models';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { OrderStatusBadgeComponent } from '../../shared/components/order-status-badge.component';
import { PaginationComponent } from '../../shared/components/pagination.component';
import { AssetUrlPipe } from '../../shared/pipes/asset-url.pipe';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    DatePipe,
    OrderStatusBadgeComponent,
    PaginationComponent,
    EmptyStateComponent,
    AssetUrlPipe
  ],
  template: `
    <section class="mb-10 flex flex-col gap-4 rounded-[2.5rem] bg-white/75 p-8 shadow-soft lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-clay">Order history</p>
        <h1 class="font-serif text-6xl text-moss">Every plant, every delivery.</h1>
      </div>
      <p class="max-w-xl text-sm leading-7 text-slate-600">
        Review your purchases, item snapshots, totals, and current order status from a single timeline.
      </p>
    </section>

    <ng-container *ngIf="ordersPage?.items?.length; else emptyOrders">
      <div class="space-y-5">
        <article *ngFor="let order of ordersPage?.items" class="surface-card p-6">
          <div class="flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.24em] text-slate-500">Order #{{ order.id }}</p>
              <p class="mt-2 font-serif text-4xl text-moss">{{ order.createdAt | date: 'mediumDate' }}</p>
              <p class="mt-2 text-sm text-slate-500">{{ order.items.length }} items</p>
            </div>
            <div class="flex flex-col items-start gap-3 md:items-end">
              <app-order-status-badge [status]="order.status" />
              <p class="text-lg font-semibold text-bark">{{ order.totalPrice | currency: 'INR':'symbol':'1.0-0' }}</p>
            </div>
          </div>

          <div class="mt-5 grid gap-4">
            <div
              *ngFor="let item of order.items"
              class="grid gap-4 rounded-3xl bg-seed/80 p-4 md:grid-cols-[88px,1fr,auto] md:items-center"
            >
              <img [src]="item.imageUrl | assetUrl" [alt]="item.plantName" class="h-24 w-full rounded-2xl object-cover" />
              <div>
                <p class="font-semibold text-moss">{{ item.plantName }}</p>
                <p class="text-sm text-slate-500">Qty {{ item.quantity }} x {{ item.price | currency: 'INR':'symbol':'1.0-0' }}</p>
              </div>
              <p class="text-sm font-semibold text-bark">{{ item.subtotal | currency: 'INR':'symbol':'1.0-0' }}</p>
            </div>
          </div>
        </article>
      </div>

      <div class="mt-10">
        <app-pagination
          [currentPage]="ordersPage?.page ?? 1"
          [totalPages]="ordersPage?.totalPages ?? 1"
          (pageChange)="loadOrders($event)"
        />
      </div>
    </ng-container>

    <ng-template #emptyOrders>
      <app-empty-state
        title="No orders yet"
        message="Once you complete your first checkout, your order history will show up here."
        actionLabel="Start shopping"
        actionLink="/plants"
      />
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersComponent {
  private readonly orderService = inject(OrderService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  ordersPage: PaginatedResponse<Order> | null = null;

  constructor() {
    this.loadOrders();
  }

  loadOrders(page = 1) {
    this.orderService.getMyOrders(page).subscribe((ordersPage) => {
      this.ordersPage = ordersPage;
      this.changeDetectorRef.markForCheck();
    });
  }
}
