import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { Analytics } from '../../core/types/models';
import { OrderStatusBadgeComponent } from '../../shared/components/order-status-badge.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe, OrderStatusBadgeComponent],
  template: `
    <section class="mb-10 flex flex-col gap-4 rounded-[2.5rem] bg-white/75 p-8 shadow-soft lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-clay">Admin dashboard</p>
        <h1 class="font-serif text-6xl text-moss">Nursery control room.</h1>
      </div>
      <div class="flex flex-wrap gap-3">
        <a routerLink="/admin/plants" class="btn-secondary">Manage plants</a>
        <a routerLink="/admin/orders" class="btn-primary">Manage orders</a>
      </div>
    </section>

    <section class="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
      <article *ngFor="let card of metricCards" class="surface-card p-5">
        <p class="text-xs uppercase tracking-[0.22em] text-slate-500">{{ card.label }}</p>
        <p class="mt-3 font-serif text-5xl text-moss">{{ card.value }}</p>
      </article>
    </section>

    <section class="mt-10 grid gap-8 xl:grid-cols-[1.1fr,0.9fr]">
      <article class="surface-card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Top sellers</p>
            <h2 class="font-serif text-4xl text-moss">Plants driving revenue</h2>
          </div>
          <a routerLink="/admin/plants" class="text-sm font-semibold text-moss hover:text-fern">Open catalog</a>
        </div>

        <div class="mt-6 space-y-4">
          <div *ngFor="let plant of analytics?.topPlants" class="rounded-3xl bg-seed/80 p-4">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="font-semibold text-moss">{{ plant.name }}</p>
                <p class="mt-1 text-sm text-slate-500">{{ plant.unitsSold }} units sold</p>
              </div>
              <p class="text-sm font-semibold text-bark">{{ plant.revenue | currency: 'INR':'symbol':'1.0-0' }}</p>
            </div>
          </div>
        </div>
      </article>

      <article class="surface-card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Recent orders</p>
            <h2 class="font-serif text-4xl text-moss">Latest activity</h2>
          </div>
          <a routerLink="/admin/orders" class="text-sm font-semibold text-moss hover:text-fern">Open orders</a>
        </div>

        <div class="mt-6 space-y-4">
          <div *ngFor="let order of analytics?.recentOrders" class="rounded-3xl bg-white p-4 shadow-sm">
            <div class="flex items-center justify-between gap-4">
              <div>
                <p class="font-semibold text-moss">#{{ order.id }} · {{ order.userName }}</p>
                <p class="mt-1 text-sm text-slate-500">{{ order.createdAt | date: 'mediumDate' }}</p>
              </div>
              <app-order-status-badge [status]="order.status" />
            </div>
          </div>
        </div>
      </article>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent {
  private readonly adminService = inject(AdminService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  analytics: Analytics | null = null;

  constructor() {
    this.adminService.getAnalytics().subscribe((analytics) => {
      this.analytics = analytics;
      this.changeDetectorRef.markForCheck();
    });
  }

  get metricCards() {
    return [
      { label: 'Revenue', value: this.analytics ? `₹${Math.round(this.analytics.totals.revenue)}` : '...' },
      { label: 'Orders', value: this.analytics?.totals.orderCount ?? '...' },
      { label: 'Pending', value: this.analytics?.totals.pendingOrders ?? '...' },
      { label: 'Users', value: this.analytics?.totals.userCount ?? '...' },
      { label: 'Active plants', value: this.analytics?.totals.plantCount ?? '...' }
    ];
  }
}
