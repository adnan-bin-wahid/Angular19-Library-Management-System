import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService, User } from '../../core/services/auth.service';
import { UpdateProfileModalComponent } from './update-profile-modal/update-profile-modal.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    UpdateProfileModalComponent,
    CardModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="container mx-auto p-4">
      <div class="max-w-2xl mx-auto">
        <p-card>
          <h2 class="text-2xl font-bold mb-6">Profile</h2>
          
          <div class="space-y-4" *ngIf="currentUser$ | async as user">
            <div class="grid grid-cols-2 gap-4">
              <div class="text-gray-600">Name:</div>
              <div>{{ user.name }}</div>
              
              <div class="text-gray-600">Email:</div>
              <div>{{ user.email }}</div>
              
              <div class="text-gray-600">Role:</div>
              <div class="capitalize">{{ user.role }}</div>
            </div>

            <div class="pt-4">
              <p-button 
                label="Update Profile"
                icon="pi pi-user-edit"
                (onClick)="showUpdateModal()"
              ></p-button>
            </div>
          </div>
        </p-card>
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