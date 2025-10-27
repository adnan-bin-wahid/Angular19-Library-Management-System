import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoanService, Loan } from '../../../core/services/loan.service';
import { AuthService } from '../../../core/services/auth.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-my-loans',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    ToastModule,
    TagModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4">
        <!-- Header Section -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-gray-800">My Loans</h1>
          <p class="mt-2 text-gray-600">View and manage your borrowed books</p>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="text-center py-8">
          <p class="text-gray-600">Loading your loans...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="error && !loading" class="text-center py-8">
          <p class="text-red-500">{{ error }}</p>
          <button 
            pButton 
            label="Try Again" 
            (click)="loadLoans()"
            class="mt-4"
          ></button>
        </div>

        <!-- No Loans -->
        <div *ngIf="!loading && !error && loans.length === 0" class="text-center py-8">
          <i class="pi pi-book text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-600">You haven't borrowed any books yet</p>
          <button 
            pButton 
            label="Browse Books" 
            routerLink="/books"
            class="mt-4"
          ></button>
        </div>

        <!-- Loans Table -->
        <div *ngIf="!loading && !error && loans.length > 0" class="card">
          <p-table [value]="loans" [tableStyle]="{ 'min-width': '50rem' }">
            <ng-template pTemplate="header">
              <tr>
                <th>Book Title</th>
                <th>Author</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-loan>
              <tr>
                <td>{{ loan.book.title }}</td>
                <td>{{ loan.book.author }}</td>
                <td>{{ loan.issue_date | date:'mediumDate' }}</td>
                <td>{{ loan.due_date | date:'mediumDate' }}</td>
                <td>
                  <p-tag 
                    [value]="loan.status"
                    [severity]="getStatusSeverity(loan.status)"
                  ></p-tag>
                </td>
                <td>
                  <button 
                    pButton 
                    icon="pi pi-eye" 
                    class="p-button-rounded p-button-text"
                    [routerLink]="['/books', loan.book.id]"
                    pTooltip="View Book Details"
                  ></button>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-tag {
      padding: 0.3rem 0.75rem;
      font-size: 0.875rem;
    }
    :host ::ng-deep .p-datatable {
      border-radius: 0.5rem;
      overflow: hidden;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
    }
    :host ::ng-deep .p-datatable .p-datatable-header {
      background: white;
      border-bottom: 1px solid #e5e7eb;
    }
    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      background: white;
      border-bottom: 2px solid #e5e7eb;
      font-weight: 600;
      color: #374151;
    }
    :host ::ng-deep .p-datatable .p-datatable-tbody > tr {
      background: white;
      transition: all 0.2s ease;
    }
    :host ::ng-deep .p-datatable .p-datatable-tbody > tr:hover {
      background: #f8fafc;
    }
  `]
})
export class MyLoansComponent implements OnInit {
  loans: Loan[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private loanService: LoanService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.error = 'Please log in to view your loans';
      return;
    }

    this.loading = true;
    this.error = null;

    this.loanService.getUserLoans(currentUser.id).subscribe({
      next: (loans) => {
        this.loans = loans;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load your loans';
        this.loading = false;
      }
    });
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'OVERDUE':
        return 'danger';
      case 'RETURNED':
        return 'info';
      default:
        return 'warning';
    }
  }
}