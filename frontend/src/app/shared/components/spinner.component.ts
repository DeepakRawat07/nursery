import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="loadingService.isLoading()"
      class="fixed inset-0 z-50 flex items-center justify-center bg-moss/10 backdrop-blur-sm"
    >
      <div class="flex items-center gap-4 rounded-full bg-white px-6 py-4 shadow-soft">
        <span class="h-4 w-4 animate-spin rounded-full border-2 border-moss/20 border-t-moss"></span>
        <span class="text-sm font-medium text-moss">Loading garden data...</span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerComponent {
  readonly loadingService = inject(LoadingService);
}
