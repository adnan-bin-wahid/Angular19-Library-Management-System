import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TimelineModule } from 'primeng/timeline';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LoanService, Loan } from '../../../core/services/loan.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    ChartModule,
    TimelineModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div class="container mx-auto px-4">
        <!-- Welcome Section -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-gray-800">Welcome Back, {{ userName }}!</h1>
          <p class="mt-2 text-gray-600">Here's an overview of your library activity</p>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button 
            class="p-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-white text-left group"
            routerLink="/books"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-semibold mb-2">Browse Books</h3>
                <p class="text-blue-100">Explore our collection</p>
              </div>
              <div class="w-12 h-12 rounded-full bg-blue-400 bg-opacity-30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <i class="pi pi-book text-2xl"></i>
              </div>
            </div>
          </button>

          <button 
            class="p-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-white text-left group"
            routerLink="/my-loans"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-semibold mb-2">My Loans</h3>
                <p class="text-purple-100">Manage borrowed books</p>
              </div>
              <div class="w-12 h-12 rounded-full bg-purple-400 bg-opacity-30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <i class="pi pi-bookmark text-2xl"></i>
              </div>
            </div>
          </button>

          <button 
            class="p-6 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-white text-left group"
            routerLink="/profile"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-semibold mb-2">My Profile</h3>
                <p class="text-green-100">View your details</p>
              </div>
              <div class="w-12 h-12 rounded-full bg-green-400 bg-opacity-30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <i class="pi pi-user text-2xl"></i>
              </div>
            </div>
          </button>
        </div>

        <!-- Statistics and Active Loans -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <!-- Statistics -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-xl shadow-lg p-6 h-full">
              <h3 class="text-xl font-semibold text-gray-800 mb-6">Your Library Statistics</h3>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div class="bg-blue-50 rounded-lg p-4 text-center">
                  <div class="text-3xl font-bold text-blue-600 mb-2">{{ totalBooks }}</div>
                  <div class="text-sm text-gray-600">Total Books Borrowed</div>
                </div>
                <div class="bg-purple-50 rounded-lg p-4 text-center">
                  <div class="text-3xl font-bold text-purple-600 mb-2">{{ activeLoans }}</div>
                  <div class="text-sm text-gray-600">Current Loans</div>
                </div>
                <div class="bg-green-50 rounded-lg p-4 text-center">
                  <div class="text-3xl font-bold text-green-600 mb-2">{{ completedLoans }}</div>
                  <div class="text-sm text-gray-600">Books Returned</div>
                </div>
              </div>

              <!-- Reading Activity Chart -->
              <div class="mt-8">
                <h4 class="text-lg font-semibold text-gray-700 mb-4">Reading Activity</h4>
                <p-chart type="line" [data]="chartData" [options]="chartOptions" height="200px"></p-chart>
              </div>
            </div>
          </div>

          <!-- Active Loans -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-semibold text-gray-800">Active Loans</h3>
              <button 
                pButton 
                label="View All" 
                class="p-button-text" 
                routerLink="/my-loans"
              ></button>
            </div>
            
            <div class="space-y-4">
              <div *ngFor="let loan of activeLoansData" class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-medium text-gray-800 mb-2">{{ loan.book.title }}</h4>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600">Due: {{ loan.due_date | date:'mediumDate' }}</span>
                  <span 
                    [class]="getDueDateClass(loan.due_date)"
                  >
                    {{ getDaysRemaining(loan.due_date) }}
                  </span>
                </div>
                <div class="mt-3 flex justify-end">
                  <button 
                    pButton 
                    label="Extend" 
                    icon="pi pi-calendar-plus"
                    class="p-button-text p-button-sm"
                    [routerLink]="['/my-loans']"
                  ></button>
                </div>
              </div>

              <div *ngIf="activeLoansData.length === 0" class="text-center py-4 text-gray-500">
                No active loans
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-6">Recent Activity</h3>
          <p-timeline [value]="activities" class="custom-timeline">
            <ng-template pTemplate="content" let-activity>
              <div class="flex items-center">
                <i [class]="activity.icon + ' mr-3 text-lg ' + activity.iconClass"></i>
                <div>
                  <h4 class="text-gray-800 font-medium mb-1">{{ activity.title }}</h4>
                  <p class="text-gray-600 text-sm">{{ activity.date | date:'medium' }}</p>
                </div>
              </div>
            </ng-template>
          </p-timeline>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-timeline .p-timeline-event-content {
      line-height: 1.5;
    }
    :host ::ng-deep .p-timeline .p-timeline-event-connector {
      background-color: #e5e7eb;
    }
    :host ::ng-deep .p-timeline .p-timeline-event-marker {
      border-color: #6366f1;
    }
    :host ::ng-deep .custom-timeline .p-timeline-event {
      margin-bottom: 2rem;
    }
    :host ::ng-deep .p-button.p-button-text:enabled:hover {
      background: rgba(99, 102, 241, 0.04);
      color: #4f46e5;
    }
  `]
})
export class StudentDashboardComponent implements OnInit {
  userName = '';
  totalBooks = 0;
  activeLoans = 0;
  completedLoans = 0;
  activeLoansData: Loan[] = [];

  chartData: any;
  chartOptions: any;

  activities = [
    { 
      title: 'Borrowed "The Great Gatsby"',
      date: new Date(),
      icon: 'pi pi-book',
      iconClass: 'text-blue-500'
    },
    {
      title: 'Extended loan for "1984"',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      icon: 'pi pi-calendar-plus',
      iconClass: 'text-green-500'
    },
    {
      title: 'Returned "The Catcher in the Rye"',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      icon: 'pi pi-check-circle',
      iconClass: 'text-purple-500'
    }
  ];

  constructor(
    private loanService: LoanService,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    const currentUser = this.authService.getCurrentUser();
    this.userName = currentUser?.name || 'Student';
  }

  ngOnInit(): void {
    this.loadUserLoans();
    this.setupChart();
  }

  loadUserLoans(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.loanService.getUserLoans(currentUser.id).subscribe({
      next: (loans) => {
        this.totalBooks = loans.length;
        this.activeLoans = loans.filter(loan => loan.status === 'ACTIVE').length;
        this.completedLoans = loans.filter(loan => loan.status === 'RETURNED').length;
        this.activeLoansData = loans
          .filter(loan => loan.status === 'ACTIVE')
          .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
          .slice(0, 3);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load your loans'
        });
      }
    });
  }

  setupChart(): void {
    const labels = ['January', 'February', 'March', 'April', 'May', 'June'];
    const data = [3, 5, 4, 6, 5, 7];

    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Books Read',
          data: data,
          fill: true,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.4
        }
      ]
    };

    this.chartOptions = {
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };
  }

  getDaysRemaining(dueDate: string): string {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    }
    return `${diffDays} days left`;
  }

  getDueDateClass(dueDate: string): string {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'text-red-600 font-medium';
    }
    if (diffDays <= 3) {
      return 'text-orange-600 font-medium';
    }
    return 'text-green-600 font-medium';
  }
}