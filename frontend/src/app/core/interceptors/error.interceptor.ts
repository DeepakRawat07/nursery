import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const toastService = inject(ToastService);
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      const message =
        (typeof error.error?.message === 'string' && error.error.message) ||
        error.message ||
        'Something went wrong.';

      if (!(request.url.includes('/auth/login') && error.status === 401)) {
        toastService.error(message);
      }

      if (error.status === 401 && authService.isAuthenticated()) {
        authService.logout(false);
        router.navigateByUrl('/login');
      }

      return throwError(() => error);
    })
  );
};
