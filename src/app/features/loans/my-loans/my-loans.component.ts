import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoanService, Loan } from '../../../core/services/loan.service';
import { AuthService } from '../../../core/services/auth.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-loans',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TableModule,
    ButtonModule,
    ToastModule,
    TagModule,
    ConfirmDialogModule,
    DialogModule,
    InputNumberModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toast></p-toast>
    <p-confirmDialog header="Return Book" icon="pi pi-exclamation-triangle"></p-confirmDialog>
    
    <!-- Extend Loan Dialog -->
    <p-dialog 
      [(visible)]="showExtendDialog" 
      header="Extend Loan" 
      [modal]="true" 
      [style]="{ width: '450px' }"
      [draggable]="false"
      [resizable]="false"
      (onHide)="closeExtendDialog()"
    >
      <div class="p-fluid">
        <div class="mb-4">
          <p class="text-gray-600 mb-4">Extend the loan period for "{{ selectedLoan?.book?.title || '' }}"</p>
          <div class="p-field">
            <label for="extensionDays" class="block text-sm font-medium text-gray-700 mb-2">
              Number of Days to Extend
            </label>
            <p-inputNumber 
              [(ngModel)]="extensionDays" 
              [min]="1" 
              [max]="30"
              [showButtons]="true"
              buttonLayout="horizontal"
              spinnerMode="horizontal"
              [step]="1"
              decrementButtonClass="p-button-secondary"
              incrementButtonClass="p-button-secondary"
              incrementButtonIcon="pi pi-plus"
              decrementButtonIcon="pi pi-minus"
              class="w-full"
            ></p-inputNumber>
          </div>
        </div>
      </div>
      <ng-template pTemplate="footer">
        <button 
          pButton 
          label="Cancel" 
          icon="pi pi-times" 
          class="p-button-text" 
          (click)="closeExtendDialog()"
        ></button>
        <button 
          pButton 
          label="Extend" 
          icon="pi pi-check" 
          class="p-button-primary" 
          (click)="confirmExtend()"
        ></button>
      </ng-template>
    </p-dialog>

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
                  <div class="flex gap-2">
                    <button 
                      pButton 
                      icon="pi pi-eye" 
                      class="p-button-rounded p-button-text"
                      [routerLink]="['/books', loan.book.id]"
                      pTooltip="View Book Details"
                    ></button>
                    <button 
                      *ngIf="loan.status === 'ACTIVE'"
                      pButton 
                      icon="pi pi-calendar-plus" 
                      class="p-button-rounded p-button-text p-button-info"
                      pTooltip="Extend Loan"
                      (click)="openExtendDialog(loan)"
                    ></button>
                    <button 
                      *ngIf="loan.status === 'ACTIVE'"
                      pButton 
                      icon="pi pi-check" 
                      class="p-button-rounded p-button-text p-button-success"
                      pTooltip="Return Book"
                      (click)="confirmReturn(loan)"
                    ></button>
                  </div>
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
  showExtendDialog = false;
  selectedLoan: Loan | null = null;
  extensionDays = 5;

  constructor(
    private loanService: LoanService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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

  openExtendDialog(loan: Loan): void {
    this.selectedLoan = loan;
    this.extensionDays = 5;
    this.showExtendDialog = true;
  }

  confirmExtend(): void {
    if (!this.selectedLoan) return;
    
    this.loanService.extendLoan(this.selectedLoan.id, this.extensionDays).subscribe({
      next: (updatedLoan) => {
        const index = this.loans.findIndex(l => l.id === updatedLoan.id);
        if (index !== -1) {
          // Keep the book information from the original loan
          this.loans[index] = {
            ...updatedLoan,
            book: this.selectedLoan!.book
          };
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Loan extended by ${this.extensionDays} days`
        });
        this.showExtendDialog = false;
        this.selectedLoan = null;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to extend the loan. Please try again.'
        });
        this.showExtendDialog = false;
        this.selectedLoan = null;
      }
    });
  }

  closeExtendDialog(): void {
    this.showExtendDialog = false;
    this.selectedLoan = null;
    this.extensionDays = 5;
  }

  confirmReturn(loan: Loan): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to return this book?',
      accept: () => {
        this.loanService.returnBook(loan.id).subscribe({
          next: (updatedLoan) => {
            const index = this.loans.findIndex(l => l.id === updatedLoan.id);
            if (index !== -1) {
              this.loans[index] = updatedLoan;
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Book returned successfully'
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error?.message || 'Failed to return the book. Please try again.'
            });
          }
        });
      }
    });
  }
}