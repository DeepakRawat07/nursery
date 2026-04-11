import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.1fr,0.9fr]">
      <div class="rounded-[2rem] bg-hero-texture p-10">
        <p class="text-sm font-semibold uppercase tracking-[0.32em] text-moss/70">Welcome back</p>
        <h1 class="mt-4 font-serif text-6xl leading-none text-moss">Log in to continue growing your collection.</h1>
        <p class="mt-6 max-w-xl text-sm leading-7 text-slate-600">
          Access your cart, wishlist, previous orders, and personalized plant picks from one place.
        </p>
      </div>

      <form class="surface-card p-8" [formGroup]="form" (ngSubmit)="submit()">
        <h2 class="font-serif text-4xl text-moss">Login</h2>
        <p class="mt-2 text-sm text-slate-500">Sign in with your account or create a new one.</p>

        <div class="mt-8 space-y-5">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input type="email" class="field" formControlName="email" placeholder="you@example.com" />
            <p *ngIf="form.controls.email.touched && form.controls.email.invalid" class="mt-2 text-xs text-rose-600">
              A valid email is required.
            </p>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <div class="relative">
              <input
                [type]="showPassword() ? 'text' : 'password'"
                class="field pr-20"
                formControlName="password"
                placeholder="Enter your password"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-moss hover:text-fern"
                (click)="togglePasswordVisibility()"
              >
                {{ showPassword() ? 'Hide' : 'Show' }}
              </button>
            </div>
            <p *ngIf="form.controls.password.touched && form.controls.password.invalid" class="mt-2 text-xs text-rose-600">
              Password is required.
            </p>
          </div>
        </div>

        <button type="submit" class="btn-primary mt-8 w-full" [disabled]="submitting()">
          {{ submitting() ? 'Signing in...' : 'Sign in' }}
        </button>

        <p class="mt-6 text-sm text-slate-600">
          New here?
          <a routerLink="/register" class="font-semibold text-moss hover:text-fern">Create an account</a>
        </p>
      </form>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  readonly submitting = signal(false);
  readonly showPassword = signal(false);
  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.toastService.success('Logged in successfully.');
        this.cartService.loadCart().subscribe();
        this.wishlistService.loadWishlist().subscribe();
        this.router.navigateByUrl(this.authService.isAdmin() ? '/admin/dashboard' : '/plants');
      },
      error: () => {
        this.submitting.set(false);
      },
      complete: () => {
        this.submitting.set(false);
      }
    });
  }
}
