import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { authGuard } from './auth/auth.guard';
import { Role } from './core/models/role.enum';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], data: { roles: [Role.MANAGER, Role.COORDINADOR] } },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }];
