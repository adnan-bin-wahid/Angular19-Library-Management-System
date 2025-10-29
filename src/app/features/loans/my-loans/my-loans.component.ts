import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoanService, Loan } from '../../../core/services/loan.service';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-my-loans',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    InputNumberModule,
    TooltipModule
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

    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div class="container mx-auto px-4">
        <!-- Header Section -->
        <div class="mb-8">
          <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div class="flex items-center gap-4 mb-2">
              <div class="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                <i class="pi pi-bookmark text-2xl text-white"></i>
              </div>
              <div>
                <h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  My Loans
                </h1>
                <p class="text-gray-600 mt-1">View and manage your borrowed books</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="text-center py-16">
          <div class="bg-white rounded-2xl shadow-lg p-12 inline-block">
            <i class="pi pi-spin pi-spinner text-6xl text-indigo-600 mb-4"></i>
            <p class="text-gray-600 font-medium">Loading your loans...</p>
          </div>
        </div>

        <!-- Error State -->
        <div *ngIf="error && !loading" class="text-center py-16">
          <div class="bg-white rounded-2xl shadow-lg p-12 inline-block">
            <i class="pi pi-exclamation-circle text-6xl text-red-500 mb-4"></i>
            <p class="text-red-600 font-medium mb-4">{{ error }}</p>
            <button 
              pButton 
              label="Try Again" 
              icon="pi pi-refresh"
              (click)="loadLoans()"
              class="p-button-rounded bg-gradient-to-r from-indigo-600 to-purple-600 border-none"
            ></button>
          </div>
        </div>

        <!-- No Loans -->
        <div *ngIf="!loading && !error && loans.length === 0" class="text-center py-16">
          <div class="bg-white rounded-2xl shadow-lg p-12 inline-block">
            <i class="pi pi-book text-6xl text-gray-300 mb-4"></i>
            <p class="text-gray-600 font-medium text-lg mb-2">You haven't borrowed any books yet</p>
            <p class="text-gray-500 text-sm mb-6">Start exploring our collection</p>
            <button 
              pButton 
              label="Browse Books" 
              icon="pi pi-search"
              routerLink="/books"
              class="p-button-rounded bg-gradient-to-r from-indigo-600 to-purple-600 border-none shadow-lg"
            ></button>
          </div>
        </div>

        <!-- Loans Table -->
        <div *ngIf="!loading && !error && loans.length > 0">
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gradient-to-r from-indigo-300 to-purple-400 text-white">
                  <tr>
                    <th class="px-6 py-4 text-left font-semibold">Book Title</th>
                    <th class="px-6 py-4 text-left font-semibold">Author</th>
                    <th class="px-6 py-4 text-left font-semibold">Issue Date</th>
                    <th class="px-6 py-4 text-left font-semibold">Due Date</th>
                    <th class="px-6 py-4 text-left font-semibold">Status</th>
                    <th class="px-6 py-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr *ngFor="let loan of loans" class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4">
                      <div class="font-semibold text-gray-800">{{ loan.book.title }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-2 text-gray-600">
                        <i class="pi pi-user text-purple-500"></i>
                        {{ loan.book.author }}
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-2 text-gray-600">
                        <i class="pi pi-calendar text-blue-500"></i>
                        {{ loan.issue_date | date:'mediumDate' }}
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-2 text-gray-600">
                        <i class="pi pi-calendar-times text-orange-500"></i>
                        {{ loan.due_date | date:'mediumDate' }}
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span 
                        class="px-3 py-1.5 rounded-full text-xs font-semibold"
                        [ngClass]="{
                          'bg-green-100 text-green-700': loan.status === 'ACTIVE',
                          'bg-blue-100 text-blue-700': loan.status === 'RETURNED',
                          'bg-red-100 text-red-700': loan.status === 'OVERDUE'
                        }"
                      >
                        {{ loan.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex gap-2 justify-center">
                        <button 
                          pButton 
                          icon="pi pi-eye" 
                          class="p-button-rounded p-button-outlined p-button-sm"
                          [routerLink]="['/books', loan.book.id]"
                          pTooltip="View Book Details"
                          tooltipPosition="top"
                        ></button>
                        <button 
                          *ngIf="loan.status === 'ACTIVE'"
                          pButton 
                          icon="pi pi-calendar-plus" 
                          class="p-button-rounded p-button-outlined p-button-sm p-button-info"
                          pTooltip="Extend Loan"
                          tooltipPosition="top"
                          (click)="openExtendDialog(loan)"
                        ></button>
                        <button 
                          *ngIf="loan.status === 'ACTIVE'"
                          pButton 
                          icon="pi pi-check" 
                          class="p-button-rounded p-button-sm"
                          pTooltip="Return Book"
                          tooltipPosition="top"
                          [style]="{'background': 'linear-gradient(to right, #10b981, #059669)', 'border': 'none'}"
                          (click)="confirmReturn(loan)"
                        ></button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
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