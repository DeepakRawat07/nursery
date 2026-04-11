import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="totalPages > 1" class="flex flex-wrap items-center justify-center gap-2">
      <button type="button" class="btn-secondary !px-4 !py-2" [disabled]="currentPage === 1" (click)="pageChange.emit(currentPage - 1)">
        Previous
      </button>
      <button
        *ngFor="let page of pages"
        type="button"
        class="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition"
        [ngClass]="page === currentPage ? 'bg-moss text-white' : 'bg-white text-slate-600 hover:bg-sage/15'"
        (click)="pageChange.emit(page)"
      >
        {{ page }}
      </button>
      <button type="button" class="btn-secondary !px-4 !py-2" [disabled]="currentPage === totalPages" (click)="pageChange.emit(currentPage + 1)">
        Next
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {
  @Input({ required: true }) currentPage = 1;
  @Input({ required: true }) totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();

  get pages() {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }
}
