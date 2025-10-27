import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule
  ],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">Dashboard</h1>
      
      <!-- Admin Section -->
      <div *ngIf="isAdmin" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Users Card -->
        <p-card styleClass="h-full">
          <div class="flex flex-col h-full">
            <div class="flex-1">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <i class="pi pi-users text-2xl text-indigo-600"></i>
                </div>
                <div>
                  <h3 class="text-xl font-semibold mb-1">Users</h3>
                  <p class="text-gray-600">Manage system users</p>
                </div>
              </div>
            </div>
            <div class="mt-4">
              <p-button 
                label="View Users" 
                icon="pi pi-arrow-right" 
                styleClass="p-button-outlined w-full"
                [routerLink]="['/users']"
              ></p-button>
            </div>
          </div>
        </p-card>

        <!-- Books Card -->
        <p-card styleClass="h-full">
          <div class="flex flex-col h-full">
            <div class="flex-1">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <i class="pi pi-book text-2xl text-green-600"></i>
                </div>
                <div>
                  <h3 class="text-xl font-semibold mb-1">Books</h3>
                  <p class="text-gray-600">Manage library books</p>
                </div>
              </div>
            </div>
            <div class="mt-4">
              <p-button 
                label="View Books" 
                icon="pi pi-arrow-right" 
                styleClass="p-button-outlined w-full"
                [routerLink]="['/books']"
              ></p-button>
            </div>
          </div>
        </p-card>

        <!-- Reports Card -->
        <p-card styleClass="h-full">
          <div class="flex flex-col h-full">
            <div class="flex-1">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <i class="pi pi-chart-bar text-2xl text-yellow-600"></i>
                </div>
                <div>
                  <h3 class="text-xl font-semibold mb-1">Reports</h3>
                  <p class="text-gray-600">View system analytics</p>
                </div>
              </div>
            </div>
            <div class="mt-4">
              <p-button 
                label="View Reports" 
                icon="pi pi-arrow-right" 
                styleClass="p-button-outlined w-full"
                [routerLink]="['/reports']"
              ></p-button>
            </div>
          </div>
        </p-card>
      </div>

      <!-- User Section -->
      <div *ngIf="!isAdmin" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Books Card -->
        <p-card styleClass="h-full">
          <div class="flex flex-col h-full">
            <div class="flex-1">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <i class="pi pi-book text-2xl text-green-600"></i>
                </div>
                <div>
                  <h3 class="text-xl font-semibold mb-1">Books</h3>
                  <p class="text-gray-600">Browse available books</p>
                </div>
              </div>
            </div>
            <div class="mt-4">
              <p-button 
                label="Browse Books" 
                icon="pi pi-arrow-right" 
                styleClass="p-button-outlined w-full"
                [routerLink]="['/books']"
              ></p-button>
            </div>
          </div>
        </p-card>

        <!-- Profile Card -->
        <p-card styleClass="h-full">
          <div class="flex flex-col h-full">
            <div class="flex-1">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <i class="pi pi-user text-2xl text-blue-600"></i>
                </div>
                <div>
                  <h3 class="text-xl font-semibold mb-1">Profile</h3>
                  <p class="text-gray-600">Manage your account</p>
                </div>
              </div>
            </div>
            <div class="mt-4">
              <p-button 
                label="View Profile" 
                icon="pi pi-arrow-right" 
                styleClass="p-button-outlined w-full"
                [routerLink]="['/profile']"
              ></p-button>
            </div>
          </div>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-card {
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    }
  `]
})
export class DashboardComponent implements OnInit {
  isAdmin = false;

  constructor(private authService: AuthService) {
    const currentUser = this.authService.getCurrentUser();
    console.log('Current user:', currentUser);
    this.isAdmin = currentUser?.role === 'admin';
    console.log('Is admin:', this.isAdmin);
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    console.log('Current user (ngOnInit):', currentUser);
    this.isAdmin = currentUser?.role === 'admin';
    console.log('Is admin (ngOnInit):', this.isAdmin);
  }
}