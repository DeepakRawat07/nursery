import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  AuthSession,
  RegistrationOtpChallenge,
  User
} from '../types/models';

interface AuthPayload {
  name?: string;
  email: string;
  password: string;
}

interface RegisterOtpPayload {
  email: string;
  otp: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly storageKey = 'nursery.auth.session';
  private readonly storedSession = this.readStoredSession();
  private readonly tokenState = signal<string | null>(this.storedSession?.token ?? null);
  private readonly userState = signal<User | null>(this.storedSession?.user ?? null);

  readonly token = this.tokenState.asReadonly();
  readonly user = this.userState.asReadonly();
  readonly isAuthenticated = computed(() => !!this.tokenState() && !!this.userState());
  readonly isAdmin = computed(() => this.userState()?.role === 'ADMIN');

  requestRegisterOtp(payload: Required<AuthPayload>) {
    return this.http
      .post<ApiResponse<RegistrationOtpChallenge>>(
        `${environment.apiBaseUrl}/auth/register/request-otp`,
        payload
      )
      .pipe(map((response) => response.data));
  }

  verifyRegisterOtp(payload: RegisterOtpPayload) {
    return this.http
      .post<ApiResponse<AuthSession>>(`${environment.apiBaseUrl}/auth/register/verify-otp`, payload)
      .pipe(
        map((response) => response.data),
        tap((session) => this.setSession(session))
      );
  }

  login(payload: AuthPayload) {
    return this.http
      .post<ApiResponse<AuthSession>>(`${environment.apiBaseUrl}/auth/login`, payload)
      .pipe(
        map((response) => response.data),
        tap((session) => this.setSession(session))
      );
  }

  refreshCurrentUser() {
    return this.http.get<ApiResponse<User>>(`${environment.apiBaseUrl}/auth/me`).pipe(
      map((response) => response.data),
      tap((user) => {
        this.userState.set(user);
        this.persistSession();
      })
    );
  }

  restoreSession() {
    const session = this.readStoredSession();

    if (!session) {
      return;
    }

    this.tokenState.set(session.token);
    this.userState.set(session.user);
  }

  logout(redirect = true) {
    this.tokenState.set(null);
    this.userState.set(null);
    this.removeStoredSession();

    if (redirect) {
      this.router.navigateByUrl('/');
    }
  }

  private setSession(session: AuthSession) {
    this.tokenState.set(session.token);
    this.userState.set(session.user);
    this.persistSession();
  }

  private readStoredSession(): AuthSession | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const rawValue = localStorage.getItem(this.storageKey);

    if (!rawValue) {
      return null;
    }

    try {
      return JSON.parse(rawValue) as AuthSession;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }

  private persistSession() {
    if (typeof localStorage === 'undefined') {
      return;
    }

    const token = this.tokenState();
    const user = this.userState();

    if (!token || !user) {
      this.removeStoredSession();
      return;
    }

    localStorage.setItem(this.storageKey, JSON.stringify({ token, user }));
  }

  private removeStoredSession() {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.removeItem(this.storageKey);
  }
}
