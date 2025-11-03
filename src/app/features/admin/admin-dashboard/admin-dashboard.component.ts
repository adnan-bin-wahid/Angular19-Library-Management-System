import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { 
  LoanService, 
  LibraryOverview, 
  ActiveUser, 
  PopularBook, 
  Loan 
} from '../../../core/services/loan.service';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    ButtonModule,
    ToastModule,
    TagModule,
    RouterModule
  ],
  providers: [MessageService],
  templateUrl: './admin-dashboard.component.html',
  styles: [`
    :host ::ng-deep .p-datatable {
      border-radius: 0.5rem;
    }
    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      background: white;
      border-bottom: 2px solid #e5e7eb;
      font-weight: 600;
      color: #374151;
      padding: 1rem;
    }
    :host ::ng-deep .p-datatable .p-datatable-tbody > tr {
      background: white;
      transition: all 0.2s ease;
    }
    :host ::ng-deep .p-datatable .p-datatable-tbody > tr:hover {
      background: #f8fafc;
    }
    :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  overview: LibraryOverview | null = null;
  activeUsers: ActiveUser[] = [];
  popularBooks: PopularBook[] = [];
  overdueLoans: Loan[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private loanService: LoanService,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/books']);
      return;
    }
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    // Load all data in parallel
    const overview$ = this.loanService.getOverview();
    const activeUsers$ = this.loanService.getActiveUsers();
    const popularBooks$ = this.loanService.getPopularBooks();
    const overdueLoans$ = this.loanService.getOverdueLoans();

    // Combine all observables
    forkJoin({
      overview: overview$,
      activeUsers: activeUsers$,
      popularBooks: popularBooks$,
      overdueLoans: overdueLoans$
    }).subscribe({
      next: (data) => {
        this.overview = data.overview;
        this.activeUsers = data.activeUsers;
        this.popularBooks = data.popularBooks;
        this.overdueLoans = data.overdueLoans;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load dashboard data';
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.error || 'Unknown error occurred'
        });
      }
    });
  }

  getDaysOverdue(dueDate: string): number {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - due.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}