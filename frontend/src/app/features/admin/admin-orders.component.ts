import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { Order, PaginatedResponse } from '../../core/types/models';
import { ToastService } from '../../core/services/toast.service';
import { OrderStatusBadgeComponent } from '../../shared/components/order-status-badge.component';
import { PaginationComponent } from '../../shared/components/pagination.component';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe, OrderStatusBadgeComponent, PaginationComponent],
  template: `
    <section class="mb-10 flex flex-col gap-4 rounded-[2.5rem] bg-white/75 p-8 shadow-soft xl:flex-row xl:items-end xl:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-clay">Order management</p>
        <h1 class="font-serif text-6xl text-moss">Fulfillment pipeline.</h1>
      </div>
      <div class="grid gap-3 sm:grid-cols-3">
        <input [(ngModel)]="search" type="search" class="field" placeholder="Search customer or order ID" />
        <select [(ngModel)]="statusFilter" class="field">
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <button type="button" class="btn-primary" (click)="loadOrders(1)">Apply filters</button>
      </div>
    </section>

    <div class="space-y-5">
      <article *ngFor="let order of ordersPage?.items" class="surface-card p-6">
        <div class="flex flex-col gap-4 border-b border-slate-100 pb-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.22em] text-slate-500">Order #{{ order.id }}</p>
            <p class="mt-2 font-serif text-4xl text-moss">{{ order.userName }}</p>
            <p class="mt-2 text-sm text-slate-500">{{ order.userEmail }} · {{ order.createdAt | date: 'medium' }}</p>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <app-order-status-badge [status]="order.status" />
            <p class="text-lg font-semibold text-bark">{{ order.totalPrice | currency: 'INR':'symbol':'1.0-0' }}</p>
          </div>
        </div>

        <div class="mt-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div class="grid gap-2 text-sm text-slate-600">
            <p>{{ order.shippingAddressLine1 }}, {{ order.shippingCity }}, {{ order.shippingState }} {{ order.shippingPostalCode }}</p>
            <p>{{ order.shippingPhone }}</p>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <select [(ngModel)]="statusDrafts[order.id]" class="field min-w-48">
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <button type="button" class="btn-primary" (click)="updateStatus(order)">
              Save status
            </button>
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminOrdersComponent {
  private readonly adminService = inject(AdminService);
  private readonly toastService = inject(ToastService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  statusFilter = '';
  search = '';
  statusDrafts: Record<number, Order['status']> = {};
  ordersPage: PaginatedResponse<Order> | null = null;

  constructor() {
    this.loadOrders();
  }

  loadOrders(page = 1) {
    this.adminService.getOrders(page, 10, this.statusFilter, this.search).subscribe((ordersPage) => {
      this.ordersPage = ordersPage;
      this.statusDrafts = Object.fromEntries(
        ordersPage.items.map((order) => [order.id, order.status])
      ) as Record<number, Order['status']>;
      this.changeDetectorRef.markForCheck();
    });
  }

  updateStatus(order: Order) {
    const nextStatus = this.statusDrafts[order.id];

    if (!nextStatus || nextStatus === order.status) {
      return;
    }

    this.adminService.updateOrderStatus(order.id, nextStatus).subscribe(() => {
      this.toastService.success('Order status updated.');
      this.loadOrders(this.ordersPage?.page ?? 1);
    });
  }
}
