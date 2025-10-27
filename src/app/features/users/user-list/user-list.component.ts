import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { User, AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    TooltipModule,
    AvatarModule,
    CardModule
  ],
  template: `
    <div class="container mx-auto p-4">
      <p-card>
        <div class="flex justify-between items-center mb-4">
          <div>
            <h2 class="text-2xl font-bold mb-2">System Users</h2>
            <p class="text-gray-600">Manage and view all users in the system</p>
          </div>
          <div class="flex gap-2">
            <p-button 
              icon="pi pi-refresh" 
              (onClick)="loadUsers()"
              styleClass="p-button-outlined"
              pTooltip="Refresh list"
            ></p-button>
          </div>
        </div>

        <!-- Users Table -->
        <p-table 
          [value]="users" 
          [paginator]="true" 
          [rows]="10"
          [showCurrentPageReport]="true"
          [tableStyle]="{'min-width': '50rem'}"
          [loading]="loading"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Email</th>
              <th>Joined Date</th>
              <th>Status</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-user>
            <tr>
              <td>
                <div class="flex items-center gap-3">
                  <p-avatar 
                    [label]="user.name.charAt(0).toUpperCase()"
                    styleClass="bg-primary"
                    [style]="{'background-color': '#4F46E5'}"
                    shape="circle"
                  ></p-avatar>
                  <div>
                    <div class="font-bold">{{ user.name }}</div>
                    <div class="text-sm text-gray-500">ID: {{ user._id }}</div>
                  </div>
                </div>
              </td>
              <td>
                <p-tag 
                  [value]="user.role" 
                  [severity]="user.role === 'admin' ? 'danger' : 'info'"
                ></p-tag>
              </td>
              <td>
                <div class="flex items-center gap-2">
                  <i class="pi pi-envelope text-gray-500"></i>
                  {{ user.email }}
                </div>
              </td>
              <td>
                <div class="flex items-center gap-2">
                  <i class="pi pi-calendar text-gray-500"></i>
                  {{ user.createdAt | date:'mediumDate' }}
                </div>
              </td>
              <td>
                <p-tag 
                  value="Active" 
                  severity="success"
                  icon="pi pi-check-circle"
                ></p-tag>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="5" class="text-center p-4">
                <div class="flex flex-col items-center gap-4">
                  <i class="pi pi-users text-4xl text-gray-400"></i>
                  <p>No users found</p>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-card {
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    }
    :host ::ng-deep .p-tag {
      text-transform: capitalize;
    }
  `]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.authService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }
}