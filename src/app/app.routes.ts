import { Routes, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { authGuard } from './core/guards/auth.guard';
import { AuthService } from './core/services/auth.service';

export const dashboardResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  return authService.isAdmin()
    ? import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
    : import('./features/student/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent);
};

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: '',
    loadComponent: () => import('./shared/layouts/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        resolve: {
          path: () => {
            const router = inject(Router);
            const authService = inject(AuthService);
            
            if (authService.isAdmin()) {
              router.navigate(['/admin-dashboard']);
            } else {
              router.navigate(['/student-dashboard']);
            }
            return true;
          }
        },
        loadComponent: () => import('./features/student/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
      },
      {
        path: 'admin-dashboard',
        canActivate: [() => inject(AuthService).isAdmin()],
        loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'student-dashboard',
        canActivate: [() => !inject(AuthService).isAdmin()],
        loadComponent: () => import('./features/student/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'books',
        loadComponent: () => import('./features/books/book-list/book-list.component').then(m => m.BookListComponent)
      },
      {
        path: 'books/:id',
        loadComponent: () => import('./features/books/book-detail/book-detail.component').then(m => m.BookDetailComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/users/user-list/user-list.component').then(m => m.UserListComponent)
      },
      {
        path: 'my-loans',
        loadComponent: () => import('./features/loans/my-loans/my-loans.component').then(m => m.MyLoansComponent)
      }
    ]
  },
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  }
];
