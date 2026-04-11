import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.1fr,0.9fr]">
      <div class="rounded-[2rem] bg-white/80 p-10 shadow-soft">
        <p class="text-sm font-semibold uppercase tracking-[0.32em] text-clay">Start growing</p>
        <h1 class="mt-4 font-serif text-6xl leading-none text-moss">Create your nursery account with verified email access.</h1>
        <p class="mt-6 max-w-xl text-sm leading-7 text-slate-600">
          We send a one-time password to your email first. After you verify the code, the account is created and you
          are signed in automatically.
        </p>

        <div class="mt-8 grid gap-4 sm:grid-cols-2">
          <div class="rounded-[1.5rem] border border-moss/10 bg-seed/80 p-5">
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Step 1</p>
            <p class="mt-3 font-serif text-3xl text-moss">Send OTP</p>
            <p class="mt-2 text-sm leading-6 text-slate-600">Enter your details and we’ll send a 6-digit code to your email.</p>
          </div>
          <div class="rounded-[1.5rem] border border-moss/10 bg-seed/80 p-5">
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Step 2</p>
            <p class="mt-3 font-serif text-3xl text-moss">Verify and continue</p>
            <p class="mt-2 text-sm leading-6 text-slate-600">Submit the OTP to finish registration and open your account.</p>
          </div>
        </div>
      </div>

      <form class="surface-card p-8" [formGroup]="form" (ngSubmit)="submit()">
        <h2 class="font-serif text-4xl text-moss">Register</h2>
        <p class="mt-2 text-sm text-slate-500">
          Passwords must include uppercase, lowercase, and a number. Email verification is required before the account is created.
        </p>

        <div class="mt-8 space-y-5">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Name</label>
            <input
              type="text"
              class="field disabled:cursor-not-allowed disabled:opacity-70"
              formControlName="name"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              class="field disabled:cursor-not-allowed disabled:opacity-70"
              formControlName="email"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <div class="relative">
              <input
                [type]="showPassword() ? 'text' : 'password'"
                class="field pr-20 disabled:cursor-not-allowed disabled:opacity-70"
                formControlName="password"
                placeholder="Create a strong password"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-moss hover:text-fern"
                (click)="togglePasswordVisibility()"
              >
                {{ showPassword() ? 'Hide' : 'Show' }}
              </button>
            </div>
          </div>

          <div *ngIf="otpRequested()" class="rounded-[1.5rem] border border-moss/10 bg-seed/70 p-4">
            <p class="text-sm font-semibold text-moss">Verification code sent</p>
              <p class="mt-2 text-sm leading-6 text-slate-600">
                We sent a 6-digit OTP to <span class="font-semibold text-moss">{{ requestedEmail() ?? form.getRawValue().email }}</span>.
                It expires in {{ otpExpiresIn() }} minutes.
              </p>
              <div *ngIf="devOtp()" class="mt-4 rounded-[1.25rem] border border-sky-200 bg-sky-50 px-4 py-4">
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.24em] text-sky-800">Local testing mode</p>
                    <p class="mt-2 text-sm leading-6 text-sky-900">
                      Email sending is off right now, so the OTP is shown here for testing. Configure SMTP later to send real emails.
                    </p>
                  </div>
                  <button
                    type="button"
                    class="rounded-full border border-sky-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-900 transition hover:bg-sky-100"
                    (click)="copyDevOtp()"
                  >
                    Copy code
                  </button>
                </div>
                <div class="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[1rem] border border-sky-200 bg-white/80 px-4 py-3">
                  <p class="font-mono text-2xl font-semibold tracking-[0.35em] text-sky-950">{{ devOtp() }}</p>
                  <button
                    type="button"
                    class="rounded-full bg-sky-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-sky-800"
                    (click)="useDevOtp()"
                  >
                    Use this code
                  </button>
                </div>
              </div>
            </div>

          <div *ngIf="otpRequested()">
            <label class="mb-2 block text-sm font-medium text-slate-700">Email OTP</label>
            <input
              type="text"
              inputmode="numeric"
              maxlength="6"
              class="field text-center tracking-[0.45em]"
              formControlName="otp"
              placeholder="123456"
              (input)="normalizeOtpInput()"
            />
            <p *ngIf="form.controls.otp.touched && form.controls.otp.invalid" class="mt-2 text-xs text-rose-600">
              Enter the 6-digit code sent to your email.
            </p>
          </div>
        </div>

        <button type="submit" class="btn-primary mt-8 w-full" [disabled]="requestingOtp() || verifyingOtp()">
          {{ submitLabel() }}
        </button>

        <div *ngIf="otpRequested()" class="mt-4 flex flex-wrap gap-3">
          <button type="button" class="btn-secondary" [disabled]="requestingOtp() || verifyingOtp()" (click)="resendOtp()">
            Resend code
          </button>
          <button type="button" class="btn-secondary" [disabled]="requestingOtp() || verifyingOtp()" (click)="editDetails()">
            Use different details
          </button>
        </div>

        <p class="mt-6 text-sm text-slate-600">
          Already have an account?
          <a routerLink="/login" class="font-semibold text-moss hover:text-fern">Login instead</a>
        </p>
      </form>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  readonly requestingOtp = signal(false);
  readonly verifyingOtp = signal(false);
  readonly showPassword = signal(false);
  readonly otpRequested = signal(false);
  readonly otpExpiresIn = signal<number | null>(null);
  readonly devOtp = signal<string | null>(null);
  readonly requestedEmail = signal<string | null>(null);
  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    otp: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^\d{6}$/)]]
  });

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  submitLabel() {
    if (this.requestingOtp()) {
      return 'Sending verification code...';
    }

    if (this.verifyingOtp()) {
      return 'Verifying code...';
    }

    return this.otpRequested() ? 'Verify OTP and create account' : 'Send verification code';
  }

  submit() {
    if (this.otpRequested()) {
      this.verifyOtp();
      return;
    }

    this.sendOtp();
  }

  resendOtp() {
    this.sendOtp(true);
  }

  editDetails() {
    this.otpRequested.set(false);
    this.otpExpiresIn.set(null);
    this.devOtp.set(null);
    this.requestedEmail.set(null);
    this.form.controls.name.enable();
    this.form.controls.email.enable();
    this.form.controls.password.enable();
    this.form.controls.otp.reset('');
    this.form.controls.otp.disable();
  }

  normalizeOtpInput() {
    const otpControl = this.form.controls.otp;
    const normalizedOtp = otpControl.getRawValue().replace(/\D/g, '').slice(0, 6);

    if (normalizedOtp !== otpControl.getRawValue()) {
      otpControl.setValue(normalizedOtp);
    }
  }

  useDevOtp() {
    const otp = this.devOtp();

    if (!otp) {
      return;
    }

    this.form.controls.otp.setValue(otp);
    this.form.controls.otp.markAsTouched();
  }

  async copyDevOtp() {
    const otp = this.devOtp();

    if (!otp) {
      return;
    }

    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      this.toastService.info('Copy is not available here. Use the OTP shown on the page.');
      return;
    }

    try {
      await navigator.clipboard.writeText(otp);
      this.toastService.success('OTP copied to clipboard.');
    } catch {
      this.toastService.info('Copy failed. Use the OTP shown on the page.');
    }
  }

  private sendOtp(isResend = false) {
    if (!this.otpRequested() && !this.registrationDetailsValid()) {
      this.markRegistrationDetailsTouched();
      return;
    }

    this.requestingOtp.set(true);
    this.authService.requestRegisterOtp(this.registrationPayload()).subscribe({
      next: (challenge) => {
        const email = challenge.email;
        this.otpRequested.set(true);
        this.otpExpiresIn.set(challenge.expiresInMinutes);
        this.devOtp.set(challenge.devOtp ?? null);
        this.requestedEmail.set(challenge.email);
        this.form.controls.name.disable();
        this.form.controls.email.setValue(challenge.email);
        this.form.controls.email.disable();
        this.form.controls.password.disable();
        this.form.controls.otp.reset('');
        this.form.controls.otp.enable();
        if (challenge.deliveryMethod === 'development') {
          this.toastService.info('Local testing mode is active. Use the OTP shown below.');
          return;
        }

        this.toastService.success(
          isResend ? `A new verification code was sent to ${email}.` : `Verification code sent to ${email}.`
        );
      },
      error: () => {
        this.requestingOtp.set(false);
      },
      complete: () => {
        this.requestingOtp.set(false);
      }
    });
  }

  private verifyOtp() {
    if (this.form.controls.otp.invalid) {
      this.form.controls.otp.markAsTouched();
      return;
    }

    this.verifyingOtp.set(true);
    this.authService
      .verifyRegisterOtp({
        email: this.requestedEmail() ?? this.form.getRawValue().email.trim(),
        otp: this.form.getRawValue().otp.replace(/\D/g, '').slice(0, 6)
      })
      .subscribe({
        next: () => {
          this.toastService.success('Account created successfully.');
          this.cartService.loadCart().subscribe();
          this.wishlistService.loadWishlist().subscribe();
          this.router.navigateByUrl('/plants');
        },
        error: () => {
          this.verifyingOtp.set(false);
        },
        complete: () => {
          this.verifyingOtp.set(false);
        }
      });
  }

  private registrationDetailsValid() {
    return (
      this.form.controls.name.valid &&
      this.form.controls.email.valid &&
      this.form.controls.password.valid
    );
  }

  private markRegistrationDetailsTouched() {
    this.form.controls.name.markAsTouched();
    this.form.controls.email.markAsTouched();
    this.form.controls.password.markAsTouched();
  }

  private registrationPayload() {
    const { name, email, password } = this.form.getRawValue();
    return { name: name.trim(), email: email.trim(), password };
  }
}
