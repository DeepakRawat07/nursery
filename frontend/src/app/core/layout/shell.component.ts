import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../shared/components/footer.component';
import { NavbarComponent } from '../../shared/components/navbar.component';
import { SpinnerComponent } from '../../shared/components/spinner.component';
import { ToastContainerComponent } from '../../shared/components/toast-container.component';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { ThemeService } from '../services/theme.service';
import { WishlistService } from '../services/wishlist.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastContainerComponent, SpinnerComponent],
  template: `
    <div class="min-h-screen">
      <app-navbar />
      <main class="mx-auto min-h-[calc(100vh-160px)] max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <router-outlet />
      </main>
      <app-footer />
      <app-toast-container />
      <app-spinner />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent {
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly themeService = inject(ThemeService);
  private readonly wishlistService = inject(WishlistService);

  constructor() {
    this.themeService.initialize();
    this.authService.restoreSession();

    if (this.authService.token()) {
      this.authService.refreshCurrentUser().subscribe({
        next: () => {
          this.cartService.loadCart().subscribe();
          this.wishlistService.loadWishlist().subscribe();
        },
        error: () => {
          this.authService.logout(false);
        }
      });
    }
  }
}
