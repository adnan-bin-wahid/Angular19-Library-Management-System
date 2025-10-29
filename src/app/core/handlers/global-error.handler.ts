import { ErrorHandler, Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private messageService = inject(MessageService);

  handleError(error: Error): void {
    console.error('Global error:', error);

    // Display user-friendly error message
    this.messageService.add({
      severity: 'error',
      summary: 'Application Error',
      detail: error.message || 'An unexpected error occurred. Please try again.',
      life: 5000
    });
  }
}
