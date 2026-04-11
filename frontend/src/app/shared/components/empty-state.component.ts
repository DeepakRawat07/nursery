import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="surface-card px-6 py-12 text-center">
      <p class="font-serif text-4xl text-moss">{{ title }}</p>
      <p class="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600">{{ message }}</p>
      <a *ngIf="actionLabel && actionLink" [routerLink]="actionLink" class="btn-primary mt-6">
        {{ actionLabel }}
      </a>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyStateComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) message = '';
  @Input() actionLabel = '';
  @Input() actionLink = '';
}
