import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  COMPANY_DESCRIPTION,
  COMPANY_NAME,
  CONTACT_INFO
} from '../../shared/contact-info';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="rounded-[2.5rem] bg-white/80 px-8 py-12 shadow-soft sm:px-10">
      <p class="text-sm font-semibold uppercase tracking-[0.3em] text-clay">Contact us</p>
      <div class="mt-5 grid gap-8 lg:grid-cols-[1.1fr,0.9fr] lg:items-start">
        <div>
          <h1 class="font-serif text-6xl leading-none text-moss">Let’s connect with {{ companyName }}.</h1>
          <p class="mt-6 max-w-2xl text-base leading-8 text-slate-600">
            {{ companyDescription }}
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a [href]="contactInfo.phoneHref" class="btn-primary">Call now</a>
            <a [href]="contactInfo.emailHref" class="btn-secondary">Send email</a>
          </div>
        </div>

        <div class="rounded-[2rem] border border-moss/10 bg-seed/80 p-6">
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Business hours</p>
          <p class="mt-3 font-serif text-4xl text-moss">{{ contactInfo.hours }}</p>
          <p class="mt-4 text-sm leading-7 text-slate-600">
            We are available every day to help with plant selection, nursery visits, and order support.
          </p>
        </div>
      </div>
    </section>

    <section class="mt-10 grid gap-6 lg:grid-cols-2">
      <article class="surface-card p-6">
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Reach us</p>
        <div class="mt-6 space-y-4">
          <div class="rounded-3xl bg-white p-4 shadow-sm">
            <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Address</p>
            <p class="mt-2 text-lg font-semibold text-moss">{{ contactInfo.address }}</p>
          </div>
          <div class="rounded-3xl bg-white p-4 shadow-sm">
            <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Phone</p>
            <a [href]="contactInfo.phoneHref" class="mt-2 block text-lg font-semibold text-moss hover:text-fern">
              {{ contactInfo.phoneDisplay }}
            </a>
          </div>
          <div class="rounded-3xl bg-white p-4 shadow-sm">
            <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Email</p>
            <a [href]="contactInfo.emailHref" class="mt-2 block break-all text-lg font-semibold text-moss hover:text-fern">
              {{ contactInfo.email }}
            </a>
          </div>
        </div>
      </article>

      <article class="surface-card p-6">
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Follow us</p>
        <p class="mt-3 max-w-xl text-sm leading-7 text-slate-600">
          Stay updated with fresh arrivals, nursery highlights, and plant care content through our social profiles.
        </p>

        <div class="mt-6 grid gap-4 sm:grid-cols-2">
          <a
            [href]="contactInfo.instagram"
            target="_blank"
            rel="noreferrer"
            class="group rounded-[1.75rem] border border-moss/10 bg-white p-5 transition hover:-translate-y-1 hover:shadow-soft"
          >
            <div class="flex items-center gap-3">
              <span class="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white">
                <svg viewBox="0 0 24 24" class="h-5 w-5 fill-current" aria-hidden="true">
                  <path
                    d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5Zm8.88 1.13a.99.99 0 1 1 0 1.98.99.99 0 0 1 0-1.98ZM12 6.5A5.5 5.5 0 1 1 6.5 12 5.5 5.5 0 0 1 12 6.5Zm0 1.5A4 4 0 1 0 16 12a4 4 0 0 0-4-4Z"
                  />
                </svg>
              </span>
              <div>
                <p class="font-semibold text-moss">Instagram</p>
                <p class="text-sm text-slate-500">Fresh updates and nursery moments</p>
              </div>
            </div>
          </a>

          <a
            [href]="contactInfo.facebook"
            target="_blank"
            rel="noreferrer"
            class="group rounded-[1.75rem] border border-moss/10 bg-white p-5 transition hover:-translate-y-1 hover:shadow-soft"
          >
            <div class="flex items-center gap-3">
              <span class="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1877f2] text-white">
                <svg viewBox="0 0 24 24" class="h-5 w-5 fill-current" aria-hidden="true">
                  <path
                    d="M13.5 21v-7.12h2.39l.36-2.78H13.5V9.33c0-.8.22-1.35 1.36-1.35h1.45V5.5a19.28 19.28 0 0 0-2.11-.11c-2.08 0-3.5 1.27-3.5 3.61v2.1H8.35v2.78h2.35V21Z"
                  />
                </svg>
              </span>
              <div>
                <p class="font-semibold text-moss">Facebook</p>
                <p class="text-sm text-slate-500">Community and business updates</p>
              </div>
            </div>
          </a>
        </div>

        <div class="mt-8 rounded-[1.75rem] border border-moss/10 bg-seed px-5 py-4">
          <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Visit note</p>
          <p class="mt-2 text-sm leading-7 text-slate-600">
            Before visiting, feel free to call and confirm stock availability for specific succulent or plant varieties.
          </p>
        </div>
      </article>
    </section>

    <section class="mt-10 rounded-[2rem] bg-moss px-8 py-8 text-white shadow-soft">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-sm uppercase tracking-[0.28em] text-white/70">Need assistance?</p>
          <h2 class="mt-2 font-serif text-4xl">We’re available every day.</h2>
        </div>
        <div class="flex flex-wrap gap-3">
          <a [href]="contactInfo.phoneHref" class="rounded-full bg-white px-5 py-3 text-sm font-semibold text-moss transition hover:bg-seed">
            {{ contactInfo.phoneDisplay }}
          </a>
          <a [href]="contactInfo.emailHref" class="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            Email us
          </a>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  readonly companyName = COMPANY_NAME;
  readonly companyDescription = COMPANY_DESCRIPTION;
  readonly contactInfo = CONTACT_INFO;
}
