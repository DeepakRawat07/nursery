import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';
import { AdminDashboardComponent } from './features/admin/admin-dashboard.component';
import { AdminOrdersComponent } from './features/admin/admin-orders.component';
import { AdminPlantFormComponent } from './features/admin/admin-plant-form.component';
import { AdminPlantsComponent } from './features/admin/admin-plants.component';
import { AdminUsersComponent } from './features/admin/admin-users.component';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { CartComponent } from './features/cart/cart.component';
import { ContactComponent } from './features/contact/contact.component';
import { HomeComponent } from './features/home/home.component';
import { OrdersComponent } from './features/orders/orders.component';
import { PlantDetailComponent } from './features/plants/plant-detail.component';
import { PlantsListComponent } from './features/plants/plants-list.component';
import { WishlistComponent } from './features/wishlist/wishlist.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'plants', component: PlantsListComponent },
  { path: 'plants/:plantId', component: PlantDetailComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'cart', canActivate: [authGuard], component: CartComponent },
  { path: 'orders', canActivate: [authGuard], component: OrdersComponent },
  { path: 'wishlist', canActivate: [authGuard], component: WishlistComponent },
  { path: 'admin', pathMatch: 'full', redirectTo: 'admin/dashboard' },
  { path: 'admin/dashboard', canActivate: [adminGuard], component: AdminDashboardComponent },
  { path: 'admin/plants', canActivate: [adminGuard], component: AdminPlantsComponent },
  { path: 'admin/plants/new', canActivate: [adminGuard], component: AdminPlantFormComponent },
  {
    path: 'admin/plants/:plantId/edit',
    canActivate: [adminGuard],
    component: AdminPlantFormComponent
  },
  { path: 'admin/orders', canActivate: [adminGuard], component: AdminOrdersComponent },
  { path: 'admin/users', canActivate: [adminGuard], component: AdminUsersComponent },
  { path: '**', redirectTo: '' }
];
