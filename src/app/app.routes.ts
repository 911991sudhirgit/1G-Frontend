import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { agentGuard } from './core/guards/agent.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
  { path: 'search', loadComponent: () => import('./features/search/search.component').then(m => m.SearchComponent) },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./features/auth/signup/signup.component').then(m => m.SignupComponent) },
  { path: 'verify-otp', loadComponent: () => import('./features/auth/verify-otp/verify-otp.component').then(m => m.VerifyOtpComponent) },
  { path: 'verify-email', loadComponent: () => import('./features/auth/verify-email/verify-email.component').then(m => m.VerifyEmailComponent) },
  { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authGuard] },
  { path: 'my-properties', loadComponent: () => import('./features/my-properties/my-properties.component').then(m => m.MyPropertiesComponent), canActivate: [authGuard] },
  { path: 'property', redirectTo: 'search', pathMatch: 'full' },
  { path: 'property/new', loadComponent: () => import('./features/property-form/property-form.component').then(m => m.PropertyFormComponent), canActivate: [authGuard] },
  { path: 'property/:id/edit', loadComponent: () => import('./features/property-form/property-form.component').then(m => m.PropertyFormComponent), canActivate: [authGuard] },
  { path: 'property/:id', loadComponent: () => import('./features/property-detail/property-detail.component').then(m => m.PropertyDetailComponent) },
  { path: 'admin', loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent), canActivate: [authGuard, adminGuard] },
  { path: 'agent/visit/:id', loadComponent: () => import('./features/agent/agent-visit-detail.component').then(m => m.AgentVisitDetailComponent), canActivate: [authGuard, agentGuard] },
  { path: 'agent', loadComponent: () => import('./features/agent/agent.component').then(m => m.AgentComponent), canActivate: [authGuard, agentGuard] },
  { path: '**', redirectTo: '' },
];
