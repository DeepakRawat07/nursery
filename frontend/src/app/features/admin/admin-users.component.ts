import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { AdminService } from '../../core/services/admin.service';
import { PaginatedResponse, User } from '../../core/types/models';
import { PaginationComponent } from '../../shared/components/pagination.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, DatePipe, PaginationComponent],
  template: `
    <section class="mb-10">
      <p class="text-sm font-semibold uppercase tracking-[0.3em] text-clay">User management</p>
      <h1 class="font-serif text-6xl text-moss">Registered customers.</h1>
    </section>

    <section class="surface-card overflow-hidden">
      <table class="min-w-full divide-y divide-slate-100 text-left">
        <thead class="bg-seed/70">
          <tr>
            <th class="px-6 py-4 text-xs uppercase tracking-[0.22em] text-slate-500">Name</th>
            <th class="px-6 py-4 text-xs uppercase tracking-[0.22em] text-slate-500">Email</th>
            <th class="px-6 py-4 text-xs uppercase tracking-[0.22em] text-slate-500">Role</th>
            <th class="px-6 py-4 text-xs uppercase tracking-[0.22em] text-slate-500">Joined</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 bg-white">
          <tr *ngFor="let user of usersPage?.items">
            <td class="px-6 py-4 font-medium text-moss">{{ user.name }}</td>
            <td class="px-6 py-4 text-sm text-slate-600">{{ user.email }}</td>
            <td class="px-6 py-4 text-sm text-slate-600">{{ user.role }}</td>
            <td class="px-6 py-4 text-sm text-slate-600">{{ user.createdAt | date: 'mediumDate' }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <div class="mt-10">
      <app-pagination
        [currentPage]="usersPage?.page ?? 1"
        [totalPages]="usersPage?.totalPages ?? 1"
        (pageChange)="loadUsers($event)"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminUsersComponent {
  private readonly adminService = inject(AdminService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  usersPage: PaginatedResponse<User> | null = null;

  constructor() {
    this.loadUsers();
  }

  loadUsers(page = 1) {
    this.adminService.getUsers(page).subscribe((usersPage) => {
      this.usersPage = usersPage;
      this.changeDetectorRef.markForCheck();
    });
  }
}
