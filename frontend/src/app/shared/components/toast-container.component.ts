import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed right-4 top-20 z-50 grid max-w-sm gap-3">
      <div
        *ngFor="let toast of toastService.toasts()"
        class="rounded-2xl border border-white/60 px-4 py-3 shadow-soft backdrop-blur"
        [ngClass]="{
          'bg-emerald-50 text-emerald-900': toast.type === 'success',
          'bg-rose-50 text-rose-900': toast.type === 'error',
          'bg-slate-50 text-slate-900': toast.type === 'info'
        }"
      >
        <div class="flex items-start justify-between gap-3">
          <p class="text-sm font-medium leading-6">{{ toast.message }}</p>
          <button type="button" class="text-xs uppercase tracking-[0.2em] opacity-60" (click)="toastService.dismiss(toast.id)">
            Close
          </button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);
}
