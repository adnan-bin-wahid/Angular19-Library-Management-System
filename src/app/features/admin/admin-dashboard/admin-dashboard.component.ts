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
  template: `
    <p-toast></p-toast>
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-gray-800">Library Dashboard</h1>
          <p class="mt-2 text-gray-600">Overview of library statistics and activities</p>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="text-center py-8">
          <p class="text-gray-600">Loading dashboard data...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="error" class="text-center py-8">
          <p class="text-red-500">{{ error }}</p>
          <button 
            pButton 
            label="Try Again" 
            (click)="loadDashboardData()"
            class="mt-4"
          ></button>
        </div>

        <div *ngIf="!loading && !error" class="space-y-8">
          <!-- Overview Stats -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-500 text-sm">Total Books</p>
                  <h3 class="text-3xl font-bold text-gray-800 mt-1">{{ overview?.total_books || 0 }}</h3>
                </div>
                <div class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <i class="pi pi-book text-blue-500 text-xl"></i>
                </div>
              </div>
              <div class="mt-4 flex items-center justify-between text-sm">
                <span class="text-green-600">{{ overview?.books_available || 0 }} Available</span>
                <span class="text-blue-600">{{ overview?.books_borrowed || 0 }} Borrowed</span>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-500 text-sm">Total Users</p>
                  <h3 class="text-3xl font-bold text-gray-800 mt-1">{{ overview?.total_users || 0 }}</h3>
                </div>
                <button 
                  pButton 
                  icon="pi pi-users" 
                  class="p-button-rounded p-button-text p-button-lg"
                  routerLink="/users"
                  pTooltip="View All Users"
                >
                </button>
              </div>
              <div class="mt-4 flex items-center justify-between text-sm">
                <span class="text-orange-600">{{ overview?.overdue_loans || 0 }} Overdue Loans</span>
                <button 
                  pButton 
                  label="Manage Users" 
                  class="p-button-link p-button-sm text-gray-600"
                  routerLink="/users"
                ></button>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-500 text-sm">Today's Loans</p>
                  <h3 class="text-3xl font-bold text-gray-800 mt-1">{{ overview?.loans_today || 0 }}</h3>
                </div>
                <div class="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                  <i class="pi pi-calendar text-purple-500 text-xl"></i>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-500 text-sm">Today's Returns</p>
                  <h3 class="text-3xl font-bold text-gray-800 mt-1">{{ overview?.returns_today || 0 }}</h3>
                </div>
                <div class="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center">
                  <i class="pi pi-check-circle text-yellow-500 text-xl"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Popular Books and Active Users -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Popular Books -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div class="p-6 border-b border-gray-100">
                <h2 class="text-xl font-semibold text-gray-800">Popular Books</h2>
                <p class="text-sm text-gray-600 mt-1">Most borrowed books in the library</p>
              </div>
              <div class="p-6">
                <p-table [value]="popularBooks" [tableStyle]="{ 'min-width': '100%' }">
                  <ng-template pTemplate="header">
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Borrows</th>
                      <th>Actions</th>
                    </tr>
                  </ng-template>
                  <ng-template pTemplate="body" let-book>
                    <tr>
                      <td>{{ book.title }}</td>
                      <td>{{ book.author }}</td>
                      <td>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {{ book.borrow_count }}
                        </span>
                      </td>
                      <td>
                        <button 
                          pButton 
                          icon="pi pi-eye" 
                          class="p-button-text p-button-sm"
                          [routerLink]="['/books', book.book_id]"
                        ></button>
                      </td>
                    </tr>
                  </ng-template>
                </p-table>
              </div>
            </div>

            <!-- Active Users -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div class="p-6 border-b border-gray-100">
                <h2 class="text-xl font-semibold text-gray-800">Active Users</h2>
                <p class="text-sm text-gray-600 mt-1">Users with current borrows</p>
              </div>
              <div class="p-6">
                <p-table [value]="activeUsers" [tableStyle]="{ 'min-width': '100%' }">
                  <ng-template pTemplate="header">
                    <tr>
                      <th>Name</th>
                      <th>Total Borrows</th>
                      <th>Current Borrows</th>
                    </tr>
                  </ng-template>
                  <ng-template pTemplate="body" let-user>
                    <tr>
                      <td>{{ user.name }}</td>
                      <td>{{ user.books_borrowed }}</td>
                      <td>
                        <span [class]="user.current_borrows > 0 ? 'text-green-600' : 'text-gray-500'">
                          {{ user.current_borrows }}
                        </span>
                      </td>
                    </tr>
                  </ng-template>
                </p-table>
              </div>
            </div>
          </div>

          <!-- Overdue Loans -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="p-6 border-b border-gray-100">
              <h2 class="text-xl font-semibold text-gray-800">Overdue Loans</h2>
              <p class="text-sm text-gray-600 mt-1">Books that are past their due date</p>
            </div>
            <div class="p-6">
              <p-table [value]="overdueLoans" [tableStyle]="{ 'min-width': '100%' }">
                <ng-template pTemplate="header">
                  <tr>
                    <th>Book Title</th>
                    <th>Due Date</th>
                    <th>Days Overdue</th>
                    <th>Actions</th>
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-loan>
                  <tr>
                    <td>{{ loan.book.title }}</td>
                    <td>{{ loan.due_date | date:'mediumDate' }}</td>
                    <td>
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {{ getDaysOverdue(loan.due_date) }} days
                      </span>
                    </td>
                    <td>
                      <button 
                        pButton 
                        icon="pi pi-eye" 
                        class="p-button-text p-button-sm"
                        [routerLink]="['/books', loan.book.id]"
                      ></button>
                    </td>
                  </tr>
                </ng-template>
              </p-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
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