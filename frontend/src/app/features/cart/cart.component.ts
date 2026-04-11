import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { ToastService } from '../../core/services/toast.service';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { AssetUrlPipe } from '../../shared/pipes/asset-url.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe, AssetUrlPipe, EmptyStateComponent],
  template: `
    <section class="mb-10">
      <p class="text-sm font-semibold uppercase tracking-[0.3em] text-clay">Shopping cart</p>
      <h1 class="font-serif text-6xl text-moss">Checkout with calm.</h1>
    </section>

    <ng-container *ngIf="cartService.cart()?.items?.length; else emptyCart">
      <div class="grid gap-8 lg:grid-cols-[1fr,0.9fr]">
        <section class="space-y-4">
          <article
            *ngFor="let item of cartService.cart()?.items"
            class="surface-card grid gap-4 p-5 md:grid-cols-[120px,1fr,auto] md:items-center"
          >
            <img [src]="item.imageUrl | assetUrl" [alt]="item.name" class="h-28 w-full rounded-2xl object-cover" />

            <div>
              <p class="font-serif text-4xl text-moss">{{ item.name }}</p>
              <p class="text-sm text-slate-500">{{ item.category }}</p>
              <p class="mt-2 text-sm text-slate-600">{{ item.price | currency: 'INR':'symbol':'1.0-0' }} each</p>
            </div>

            <div class="flex flex-col items-end gap-3">
              <div class="flex items-center rounded-full border border-slate-200 bg-white">
                <button
                  type="button"
                  class="px-4 py-2 text-lg text-moss"
                  (click)="changeQuantity(item.id, item.quantity - 1, item.quantity === 1)"
                >
                  -
                </button>
                <span class="min-w-12 text-center text-sm font-semibold text-slate-700">{{ item.quantity }}</span>
                <button type="button" class="px-4 py-2 text-lg text-moss" (click)="changeQuantity(item.id, item.quantity + 1)">
                  +
                </button>
              </div>
              <p class="text-lg font-semibold text-bark">{{ item.subtotal | currency: 'INR':'symbol':'1.0-0' }}</p>
              <button type="button" class="text-sm font-semibold text-rose-600" (click)="removeItem(item.id)">
                Remove
              </button>
            </div>
          </article>
        </section>

        <aside class="surface-card p-6">
          <h2 class="font-serif text-4xl text-moss">Delivery details</h2>
          <form class="mt-6 space-y-4" [formGroup]="checkoutForm" (ngSubmit)="submitOrder()">
            <input class="field" type="text" formControlName="shippingName" placeholder="Full name" />
            <input class="field" type="email" formControlName="shippingEmail" placeholder="Email address" />
            <input class="field" type="tel" formControlName="shippingPhone" placeholder="Phone number" />
            <input class="field" type="text" formControlName="shippingAddressLine1" placeholder="Address line 1" />
            <input class="field" type="text" formControlName="shippingAddressLine2" placeholder="Address line 2 (optional)" />
            <div class="grid gap-4 sm:grid-cols-3">
              <input class="field" type="text" formControlName="shippingCity" placeholder="City" />
              <input class="field" type="text" formControlName="shippingState" placeholder="State" />
              <input class="field" type="text" formControlName="shippingPostalCode" placeholder="Postal code" />
            </div>

            <div class="rounded-3xl bg-seed p-5">
              <div class="flex items-center justify-between text-sm text-slate-600">
                <span>Items</span>
                <span>{{ cartService.cart()?.itemCount }}</span>
              </div>
              <div class="mt-2 flex items-center justify-between text-sm text-slate-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div class="mt-4 flex items-center justify-between text-lg font-semibold text-bark">
                <span>Total</span>
                <span>{{ cartService.totalPrice() | currency: 'INR':'symbol':'1.0-0' }}</span>
              </div>
            </div>

            <button type="submit" class="btn-primary w-full" [disabled]="submitting()">
              {{ submitting() ? 'Placing order...' : 'Place order' }}
            </button>
          </form>
        </aside>
      </div>
    </ng-container>

    <ng-template #emptyCart>
      <app-empty-state
        title="Your cart is empty"
        message="Browse the nursery catalog and add a few plants before checking out."
        actionLabel="Explore plants"
        actionLink="/plants"
      />
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {
  readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  readonly submitting = signal(false);
  readonly checkoutForm = this.formBuilder.nonNullable.group({
    shippingName: [this.authService.user()?.name || '', [Validators.required]],
    shippingEmail: [this.authService.user()?.email || '', [Validators.required, Validators.email]],
    shippingPhone: ['', [Validators.required]],
    shippingAddressLine1: ['', [Validators.required]],
    shippingAddressLine2: [''],
    shippingCity: ['', [Validators.required]],
    shippingState: ['', [Validators.required]],
    shippingPostalCode: ['', [Validators.required]]
  });

  constructor() {
    this.cartService.loadCart().subscribe();
  }

  changeQuantity(itemId: number, quantity: number, removeInstead = false) {
    if (removeInstead || quantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    this.cartService.updateItem(itemId, quantity).subscribe(() => {
      this.toastService.success('Cart updated.');
    });
  }

  removeItem(itemId: number) {
    this.cartService.removeItem(itemId).subscribe(() => {
      this.toastService.success('Item removed from cart.');
    });
  }

  submitOrder() {
    if (this.checkoutForm.invalid || !this.cartService.cart()?.items.length) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.orderService.checkout(this.checkoutForm.getRawValue()).subscribe({
      next: () => {
        this.toastService.success('Order placed successfully.');
        this.cartService.loadCart().subscribe();
        this.router.navigateByUrl('/orders');
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
