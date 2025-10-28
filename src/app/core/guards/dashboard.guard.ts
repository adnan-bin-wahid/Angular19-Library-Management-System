import { inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const dashboardGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    router.navigate(['/admin-dashboard']);
    return false;
  } else {
    router.navigate(['/student-dashboard']);
    return false;
  }
};