import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';
      let errorDetail = 'Please try again later';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = 'Network Error';
        errorDetail = error.error.message;
      } else {
        // Server-side error
        switch (error.status) {
          case 400:
            errorMessage = 'Bad Request';
            errorDetail = error.error?.message || 'Invalid request data';
            break;
          case 401:
            errorMessage = 'Unauthorized';
            errorDetail = 'Please login to continue';
            authService.logout().subscribe();
            router.navigate(['/auth/login']);
            break;
          case 403:
            errorMessage = 'Forbidden';
            errorDetail = 'You do not have permission to access this resource';
            break;
          case 404:
            errorMessage = 'Not Found';
            errorDetail = error.error?.message || 'Resource not found';
            break;
          case 409:
            errorMessage = 'Conflict';
            errorDetail = error.error?.message || 'Resource already exists';
            break;
          case 500:
            errorMessage = 'Server Error';
            errorDetail = 'Internal server error. Please contact support';
            break;
          case 503:
            errorMessage = 'Service Unavailable';
            errorDetail = 'The service is temporarily unavailable';
            break;
          default:
            errorMessage = `Error ${error.status}`;
            errorDetail = error.error?.message || error.message || 'An unexpected error occurred';
        }
      }

      // Show toast notification
      messageService.add({
        severity: 'error',
        summary: errorMessage,
        detail: errorDetail,
        life: 5000
      });

      // Log to console for debugging
      console.error('HTTP Error:', {
        status: error.status,
        message: errorMessage,
        detail: errorDetail,
        url: error.url,
        error: error.error
      });

      return throwError(() => error);
    })
  );
};
