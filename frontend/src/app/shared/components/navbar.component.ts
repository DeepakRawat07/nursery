import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { ThemeService } from '../../core/services/theme.service';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-30 border-b border-white/60 bg-seed/80 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <a routerLink="/" class="shrink-0">
          <img
            src="assets/uttarakhand-succulent-logo.svg"
            alt="Uttarakhand Succulent"
            width="640"
            height="144"
            class="block h-10 w-auto sm:h-12 lg:h-14"
          />
        </a>

        <button
          type="button"
          class="rounded-full border border-moss/15 px-4 py-2 text-sm font-semibold text-moss lg:hidden"
          (click)="toggleMobile()"
        >
          Menu
        </button>

        <div class="hidden flex-1 items-center justify-end gap-3 lg:flex">
          <nav class="flex items-center gap-2 rounded-[2rem] border border-white/80 bg-white/70 p-2 shadow-soft">
            <a
              routerLink="/"
              routerLinkActive="border-moss bg-moss text-white shadow-sm"
              [routerLinkActiveOptions]="{ exact: true }"
              class="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-moss/10 hover:bg-white hover:text-moss"
            >
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-white text-moss shadow-sm ring-1 ring-black/5">
                <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M12 3.2 3.5 10v10.3h6.1v-5.9h4.8v5.9h6.1V10L12 3.2Zm0 1.9 6.7 5.3v8.4h-2.9v-5.9H8.2v5.9H5.3v-8.4L12 5.1Z" />
                </svg>
              </span>
              <span>Home</span>
            </a>

            <a
              routerLink="/plants"
              routerLinkActive="border-moss bg-moss text-white shadow-sm"
              class="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-moss/10 hover:bg-white hover:text-moss"
            >
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-white text-moss shadow-sm ring-1 ring-black/5">
                <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M18.9 3.8c-4.6.2-7.8 1.7-9.8 4.5-1.4 2-2 4.3-2 7 .7-1 1.7-1.8 3-2.3 1.4-.6 3-.8 4.8-.7-2.7.9-4.8 2.4-6.2 4.4-.7 1-1.3 2.2-1.7 3.5h1.9c.4-1.2.9-2.2 1.5-3 1.2-1.7 3.1-3 5.7-3.9l.7-.2.1-.7c.4-2.7 1.5-5.2 3.3-7.3.3-.4.6-.7 1-.9l-.3-1.4Z" />
                </svg>
              </span>
              <span>Plants</span>
            </a>

            <a
              routerLink="/contact"
              routerLinkActive="border-moss bg-moss text-white shadow-sm"
              class="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-moss/10 hover:bg-white hover:text-moss"
            >
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-white text-moss shadow-sm ring-1 ring-black/5">
                <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M12 2.8a6.4 6.4 0 0 0-6.4 6.4c0 4.4 5.1 10.7 5.7 11.4l.7.8.7-.8c.6-.7 5.7-7 5.7-11.4A6.4 6.4 0 0 0 12 2.8Zm0 9.3a2.9 2.9 0 1 1 0-5.8 2.9 2.9 0 0 1 0 5.8Z" />
                </svg>
              </span>
              <span>Contact</span>
            </a>

            <a
              *ngIf="authService.isAuthenticated()"
              routerLink="/wishlist"
              routerLinkActive="border-moss bg-moss text-white shadow-sm"
              class="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-moss/10 hover:bg-white hover:text-moss"
            >
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-white text-moss shadow-sm ring-1 ring-black/5">
                <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M12 20.9 4.9 14c-1.4-1.3-2.1-2.9-2.1-4.7a5 5 0 0 1 8.7-3.4L12 6.4l.5-.5a5 5 0 0 1 8.7 3.4c0 1.8-.7 3.4-2.1 4.7L12 20.9Z" />
                </svg>
              </span>
              <span>Wishlist</span>
              <span class="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-moss shadow-sm">
                {{ wishlistService.itemCount() }}
              </span>
            </a>

            <a
              *ngIf="authService.isAuthenticated()"
              routerLink="/orders"
              routerLinkActive="border-moss bg-moss text-white shadow-sm"
              class="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-moss/10 hover:bg-white hover:text-moss"
            >
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-white text-moss shadow-sm ring-1 ring-black/5">
                <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M6 4.5h12a1.5 1.5 0 0 1 1.5 1.5v12.5L15 16H6A1.5 1.5 0 0 1 4.5 14.5V6A1.5 1.5 0 0 1 6 4.5Zm0 1.5v8.5h9.5l2.5 1.9V6H6Zm2 2h8v1.5H8V8Zm0 3h8v1.5H8V11Z" />
                </svg>
              </span>
              <span>Orders</span>
            </a>

            <a
              routerLink="/cart"
              routerLinkActive="border-moss bg-moss text-white shadow-sm"
              class="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-moss/10 hover:bg-white hover:text-moss"
            >
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-white text-moss shadow-sm ring-1 ring-black/5">
                <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M7.2 6.3 8 9h10.7l-1.4 5.1H9.2L6.8 5.8H3.5V4.3h4.4l.6 2Zm2.1 9.5a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4Zm7 0a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4Z" />
                </svg>
              </span>
              <span>Cart</span>
              <span class="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-moss shadow-sm">
                {{ cartService.itemCount() }}
              </span>
            </a>

            <a
              *ngIf="authService.isAdmin()"
              routerLink="/admin/dashboard"
              routerLinkActive="border-moss bg-moss text-white shadow-sm"
              class="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-moss/10 hover:bg-white hover:text-moss"
            >
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-white text-moss shadow-sm ring-1 ring-black/5">
                <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M12 2.8 4.3 5.6v5.7c0 4.2 2.5 8.1 6.5 9.9l1.2.5 1.2-.5c4-1.8 6.5-5.7 6.5-9.9V5.6L12 2.8Zm0 1.6 6.2 2.2v4.7c0 3.6-2.1 6.9-5.6 8.5l-.6.3-.6-.3c-3.5-1.6-5.6-4.9-5.6-8.5V6.6L12 4.4Zm-.9 3.2h1.8v4.1h3.6v1.7h-5.4V7.6Z" />
                </svg>
              </span>
              <span>Admin</span>
            </a>
          </nav>

          <button
            type="button"
            class="theme-toggle shrink-0"
            [attr.aria-label]="themeService.isDark() ? 'Switch to day mode' : 'Switch to night mode'"
            [attr.aria-pressed]="themeService.isDark()"
            (click)="toggleTheme()"
          >
            <span class="theme-toggle-badge">
              <ng-container *ngIf="themeService.isDark(); else desktopMoonIcon">
                <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
                  <path
                    d="M12 3.8a.8.8 0 0 1 .8.8v1.1a.8.8 0 1 1-1.6 0V4.6a.8.8 0 0 1 .8-.8Zm0 14.5a.8.8 0 0 1 .8.8v1.1a.8.8 0 1 1-1.6 0v-1.1a.8.8 0 0 1 .8-.8Zm8.2-6.3a.8.8 0 0 1 0 1.6h-1.1a.8.8 0 0 1 0-1.6h1.1Zm-14.4 0a.8.8 0 0 1 0 1.6H4.7a.8.8 0 0 1 0-1.6h1.1Zm11.03-4.83a.8.8 0 0 1 1.14 1.13l-.79.79a.8.8 0 0 1-1.13-1.14l.78-.78Zm-10.18 10.18a.8.8 0 0 1 1.13 1.14l-.78.78a.8.8 0 1 1-1.14-1.13l.79-.79Zm10.96 1.92a.8.8 0 0 1-1.13 0l-.78-.78a.8.8 0 0 1 1.13-1.14l.78.79a.8.8 0 0 1 0 1.13ZM6.61 6.9a.8.8 0 0 1 0 1.13l-.79.78A.8.8 0 1 1 4.7 7.68l.78-.78a.8.8 0 0 1 1.13 0ZM12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6Z"
                  />
                </svg>
              </ng-container>
              <ng-template #desktopMoonIcon>
                <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M20.6 14.2A8.8 8.8 0 0 1 9.8 3.4a9.1 9.1 0 1 0 10.8 10.8Z" />
                </svg>
              </ng-template>
            </span>
            <span class="hidden xl:inline">{{ themeService.isDark() ? 'Day mode' : 'Night mode' }}</span>
          </button>

          <ng-container *ngIf="authService.isAuthenticated(); else guestLinks">
            <div class="flex items-center gap-3 rounded-[1.75rem] border border-white/80 bg-white/90 px-4 py-2 shadow-sm">
              <div>
                <p class="text-sm font-semibold text-moss">{{ authService.user()?.name }}</p>
                <p class="text-xs uppercase tracking-[0.18em] text-slate-500">{{ authService.user()?.role }}</p>
              </div>
              <button type="button" class="btn-secondary !px-4 !py-2" (click)="logout()">Logout</button>
            </div>
          </ng-container>
        </div>
      </div>

      <div *ngIf="mobileOpen()" class="border-t border-white/60 bg-white/90 px-4 py-4 lg:hidden">
        <div class="grid gap-2">
          <div *ngIf="authService.isAuthenticated()" class="mb-2 rounded-[1.75rem] border border-moss/10 bg-seed/70 px-4 py-4">
            <p class="text-sm font-semibold text-moss">{{ authService.user()?.name }}</p>
            <p class="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{{ authService.user()?.role }}</p>
          </div>

          <button
            type="button"
            class="theme-toggle mb-2 w-full justify-between"
            [attr.aria-label]="themeService.isDark() ? 'Switch to day mode' : 'Switch to night mode'"
            [attr.aria-pressed]="themeService.isDark()"
            (click)="toggleTheme()"
          >
            <span class="flex items-center gap-3">
              <span class="theme-toggle-badge">
                <ng-container *ngIf="themeService.isDark(); else mobileMoonIcon">
                  <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
                    <path
                      d="M12 3.8a.8.8 0 0 1 .8.8v1.1a.8.8 0 1 1-1.6 0V4.6a.8.8 0 0 1 .8-.8Zm0 14.5a.8.8 0 0 1 .8.8v1.1a.8.8 0 1 1-1.6 0v-1.1a.8.8 0 0 1 .8-.8Zm8.2-6.3a.8.8 0 0 1 0 1.6h-1.1a.8.8 0 0 1 0-1.6h1.1Zm-14.4 0a.8.8 0 0 1 0 1.6H4.7a.8.8 0 0 1 0-1.6h1.1Zm11.03-4.83a.8.8 0 0 1 1.14 1.13l-.79.79a.8.8 0 0 1-1.13-1.14l.78-.78Zm-10.18 10.18a.8.8 0 0 1 1.13 1.14l-.78.78a.8.8 0 1 1-1.14-1.13l.79-.79Zm10.96 1.92a.8.8 0 0 1-1.13 0l-.78-.78a.8.8 0 0 1 1.13-1.14l.78.79a.8.8 0 0 1 0 1.13ZM6.61 6.9a.8.8 0 0 1 0 1.13l-.79.78A.8.8 0 1 1 4.7 7.68l.78-.78a.8.8 0 0 1 1.13 0ZM12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6Z"
                    />
                  </svg>
                </ng-container>
                <ng-template #mobileMoonIcon>
                  <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
                    <path d="M20.6 14.2A8.8 8.8 0 0 1 9.8 3.4a9.1 9.1 0 1 0 10.8 10.8Z" />
                  </svg>
                </ng-template>
              </span>
              <span>{{ themeService.isDark() ? 'Switch to day mode' : 'Switch to night mode' }}</span>
            </span>
            <span class="text-xs uppercase tracking-[0.18em] text-slate-500">
              {{ themeService.isDark() ? 'Night' : 'Day' }}
            </span>
          </button>

          <a routerLink="/" (click)="closeMobile()" class="flex items-center justify-between rounded-2xl border border-moss/10 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
            <span class="flex items-center gap-3">
              <span class="flex h-9 w-9 items-center justify-center rounded-full bg-seed text-moss">
                <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M12 3.2 3.5 10v10.3h6.1v-5.9h4.8v5.9h6.1V10L12 3.2Zm0 1.9 6.7 5.3v8.4h-2.9v-5.9H8.2v5.9H5.3v-8.4L12 5.1Z" />
                </svg>
              </span>
              <span>Home</span>
            </span>
          </a>

          <a routerLink="/plants" (click)="closeMobile()" class="flex items-center justify-between rounded-2xl border border-moss/10 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
            <span class="flex items-center gap-3">
              <span class="flex h-9 w-9 items-center justify-center rounded-full bg-seed text-moss">
                <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M18.9 3.8c-4.6.2-7.8 1.7-9.8 4.5-1.4 2-2 4.3-2 7 .7-1 1.7-1.8 3-2.3 1.4-.6 3-.8 4.8-.7-2.7.9-4.8 2.4-6.2 4.4-.7 1-1.3 2.2-1.7 3.5h1.9c.4-1.2.9-2.2 1.5-3 1.2-1.7 3.1-3 5.7-3.9l.7-.2.1-.7c.4-2.7 1.5-5.2 3.3-7.3.3-.4.6-.7 1-.9l-.3-1.4Z" />
                </svg>
              </span>
              <span>Plants</span>
            </span>
          </a>

          <a routerLink="/contact" (click)="closeMobile()" class="flex items-center justify-between rounded-2xl border border-moss/10 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
            <span class="flex items-center gap-3">
              <span class="flex h-9 w-9 items-center justify-center rounded-full bg-seed text-moss">
                <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M12 2.8a6.4 6.4 0 0 0-6.4 6.4c0 4.4 5.1 10.7 5.7 11.4l.7.8.7-.8c.6-.7 5.7-7 5.7-11.4A6.4 6.4 0 0 0 12 2.8Zm0 9.3a2.9 2.9 0 1 1 0-5.8 2.9 2.9 0 0 1 0 5.8Z" />
                </svg>
              </span>
              <span>Contact</span>
            </span>
          </a>

          <a routerLink="/cart" (click)="closeMobile()" class="flex items-center justify-between rounded-2xl border border-moss/10 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
            <span class="flex items-center gap-3">
              <span class="flex h-9 w-9 items-center justify-center rounded-full bg-seed text-moss">
                <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M7.2 6.3 8 9h10.7l-1.4 5.1H9.2L6.8 5.8H3.5V4.3h4.4l.6 2Zm2.1 9.5a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4Zm7 0a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4Z" />
                </svg>
              </span>
              <span>Cart</span>
            </span>
            <span class="rounded-full bg-seed px-2 py-0.5 text-xs font-semibold text-moss">{{ cartService.itemCount() }}</span>
          </a>

          <a *ngIf="authService.isAuthenticated()" routerLink="/wishlist" (click)="closeMobile()" class="flex items-center justify-between rounded-2xl border border-moss/10 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
            <span class="flex items-center gap-3">
              <span class="flex h-9 w-9 items-center justify-center rounded-full bg-seed text-moss">
                <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M12 20.9 4.9 14c-1.4-1.3-2.1-2.9-2.1-4.7a5 5 0 0 1 8.7-3.4L12 6.4l.5-.5a5 5 0 0 1 8.7 3.4c0 1.8-.7 3.4-2.1 4.7L12 20.9Z" />
                </svg>
              </span>
              <span>Wishlist</span>
            </span>
            <span class="rounded-full bg-seed px-2 py-0.5 text-xs font-semibold text-moss">{{ wishlistService.itemCount() }}</span>
          </a>

          <a *ngIf="authService.isAuthenticated()" routerLink="/orders" (click)="closeMobile()" class="flex items-center justify-between rounded-2xl border border-moss/10 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
            <span class="flex items-center gap-3">
              <span class="flex h-9 w-9 items-center justify-center rounded-full bg-seed text-moss">
                <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M6 4.5h12a1.5 1.5 0 0 1 1.5 1.5v12.5L15 16H6A1.5 1.5 0 0 1 4.5 14.5V6A1.5 1.5 0 0 1 6 4.5Zm0 1.5v8.5h9.5l2.5 1.9V6H6Zm2 2h8v1.5H8V8Zm0 3h8v1.5H8V11Z" />
                </svg>
              </span>
              <span>Orders</span>
            </span>
          </a>

          <a *ngIf="authService.isAdmin()" routerLink="/admin/dashboard" (click)="closeMobile()" class="flex items-center justify-between rounded-2xl border border-moss/10 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
            <span class="flex items-center gap-3">
              <span class="flex h-9 w-9 items-center justify-center rounded-full bg-seed text-moss">
                <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M12 2.8 4.3 5.6v5.7c0 4.2 2.5 8.1 6.5 9.9l1.2.5 1.2-.5c4-1.8 6.5-5.7 6.5-9.9V5.6L12 2.8Zm0 1.6 6.2 2.2v4.7c0 3.6-2.1 6.9-5.6 8.5l-.6.3-.6-.3c-3.5-1.6-5.6-4.9-5.6-8.5V6.6L12 4.4Zm-.9 3.2h1.8v4.1h3.6v1.7h-5.4V7.6Z" />
                </svg>
              </span>
              <span>Admin</span>
            </span>
          </a>

          <a *ngIf="!authService.isAuthenticated()" routerLink="/login" (click)="closeMobile()" class="rounded-2xl border border-moss/10 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">Login</a>
          <a *ngIf="!authService.isAuthenticated()" routerLink="/register" (click)="closeMobile()" class="rounded-2xl border border-moss/10 bg-moss px-4 py-3 text-sm font-medium text-white shadow-sm">Register</a>
          <button *ngIf="authService.isAuthenticated()" type="button" class="btn-secondary mt-2" (click)="logout()">Logout</button>
        </div>
      </div>
    </header>

    <ng-template #guestLinks>
      <div class="ml-4 flex items-center gap-3">
        <a routerLink="/login" class="btn-secondary !px-4 !py-2">Login</a>
        <a routerLink="/register" class="btn-primary !px-4 !py-2">Register</a>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  readonly authService = inject(AuthService);
  readonly cartService = inject(CartService);
  readonly themeService = inject(ThemeService);
  readonly wishlistService = inject(WishlistService);
  private readonly router = inject(Router);
  readonly mobileOpen = signal(false);

  logout() {
    this.mobileOpen.set(false);
    this.authService.logout();
    this.cartService.clear();
    this.wishlistService.clear();
    this.router.navigateByUrl('/');
  }

  toggleMobile() {
    this.mobileOpen.update((open) => !open);
  }

  toggleTheme() {
    this.themeService.toggle();
  }

  closeMobile() {
    this.mobileOpen.set(false);
  }
}
