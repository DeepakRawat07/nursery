import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
      [ngClass]="statusClasses"
    >
      {{ status }}
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderStatusBadgeComponent {
  @Input({ required: true }) status = 'PENDING';

  get statusClasses() {
    const map: Record<string, string> = {
      PENDING: 'bg-amber-100 text-amber-800',
      PROCESSING: 'bg-sky-100 text-sky-800',
      SHIPPED: 'bg-indigo-100 text-indigo-800',
      DELIVERED: 'bg-emerald-100 text-emerald-800',
      CANCELLED: 'bg-rose-100 text-rose-800'
    };

    return map[this.status] || 'bg-slate-100 text-slate-700';
  }
}
