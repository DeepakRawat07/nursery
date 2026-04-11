import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastsState = signal<ToastMessage[]>([]);
  readonly toasts = this.toastsState.asReadonly();

  success(message: string) {
    this.enqueue('success', message);
  }

  error(message: string) {
    this.enqueue('error', message);
  }

  info(message: string) {
    this.enqueue('info', message);
  }

  dismiss(id: number) {
    this.toastsState.update((messages) => messages.filter((message) => message.id !== id));
  }

  private enqueue(type: ToastMessage['type'], message: string) {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    this.toastsState.update((messages) => [...messages, { id, type, message }]);
    setTimeout(() => this.dismiss(id), 3500);
  }
}
