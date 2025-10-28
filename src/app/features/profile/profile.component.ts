import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../core/services/auth.service';
import { UpdateProfileModalComponent } from './update-profile-modal/update-profile-modal.component';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { RippleModule } from 'primeng/ripple';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    UpdateProfileModalComponent,
    ButtonModule,
    ToastModule,
    RippleModule
  ],
  providers: [MessageService],
  template: `
    <div class="container mx-auto p-4">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
          <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <div class="flex items-center justify-between">
              <h2 class="text-3xl font-bold">My Profile</h2>
              <p-button 
                icon="pi pi-user-edit"
                label="Edit Profile"
                (onClick)="showUpdateModal()"
                styleClass="p-button-rounded p-button-outlined"
                [style]="{'background': 'rgba(255,255,255,0.1)', 'border': '2px solid rgba(255,255,255,0.2)'}"
              ></p-button>
            </div>
          </div>
          
          <div class="p-8" *ngIf="currentUser$ | async as user">
            <div class="flex flex-col md:flex-row gap-8">
              <!-- Profile Picture Section -->
              <div class="flex-none">
                <div class="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-4xl font-bold text-white shadow-lg border-4 border-white">
                  {{ user.name[0].toUpperCase() }}
                </div>
              </div>
              
              <!-- Profile Details Section -->
              <div class="flex-grow space-y-6">
                <!-- User Info Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Name Card -->
                  <div class="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-xl border border-indigo-100">
                    <div class="text-sm text-indigo-600 mb-1">Full Name</div>
                    <div class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <i class="pi pi-user text-indigo-500"></i>
                      {{ user.name }}
                    </div>
                  </div>
                  
                  <!-- Email Card -->
                  <div class="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl border border-purple-100">
                    <div class="text-sm text-purple-600 mb-1">Email Address</div>
                    <div class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <i class="pi pi-envelope text-purple-500"></i>
                      {{ user.email }}
                    </div>
                  </div>
                  
                  <!-- Role Card -->
                  <div class="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-100">
                    <div class="text-sm text-blue-600 mb-1">Role</div>
                    <div class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <i class="pi pi-shield text-blue-500"></i>
                      {{ user.role | titlecase }}
                    </div>
                  </div>
                  
                  <!-- Stats Card -->
                  <div class="bg-gradient-to-br from-pink-50 to-white p-4 rounded-xl border border-pink-100">
                    <div class="text-sm text-pink-600 mb-1">Account Status</div>
                    <div class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <i class="pi pi-check-circle text-pink-500"></i>
                      Active
                    </div>
                  </div>
                </div>
                
                <!-- Activity Section -->
                <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                  <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <i class="pi pi-clock text-gray-600"></i>
                    Recent Activity
                  </h3>
                  <div class="text-sm text-gray-600">
                    No recent activity to display
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <app-update-profile-modal
      [(visible)]="showModal"
      [user]="(currentUser$ | async)!"
      (userUpdated)="onUserUpdated($event)"
    ></app-update-profile-modal>
    
    <p-toast></p-toast>
  `
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  
  currentUser$: Observable<User | null> = this.authService.user$;
  showModal = false;

  showUpdateModal(): void {
    this.showModal = true;
  }

  onUserUpdated(userData: { name: string; role: string }): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.authService.updateUser(currentUser.id, userData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Profile updated successfully'
          });
        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message || 'Failed to update profile'
          });
        }
      });
    }
  }
}