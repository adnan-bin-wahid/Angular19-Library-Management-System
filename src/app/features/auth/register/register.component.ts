import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    ToastModule,
    DropdownModule
  ],
  providers: [MessageService],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <p-card class="w-full max-w-md">
        <h2 class="mb-6 text-center text-2xl font-bold text-gray-800">Register</h2>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="flex flex-col gap-2">
            <label for="name" class="text-sm font-medium text-gray-700">Name</label>
            <input 
              id="name" 
              type="text" 
              pInputText 
              formControlName="name"
              class="w-full"
              [ngClass]="{'ng-invalid ng-dirty': registerForm.get('name')?.invalid && registerForm.get('name')?.touched}"
            />
            <small class="text-red-500" *ngIf="registerForm.get('name')?.invalid && registerForm.get('name')?.touched">
              Name is required
            </small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="email" class="text-sm font-medium text-gray-700">Email</label>
            <input 
              id="email" 
              type="email" 
              pInputText 
              formControlName="email"
              class="w-full"
              [ngClass]="{'ng-invalid ng-dirty': registerForm.get('email')?.invalid && registerForm.get('email')?.touched}"
            />
            <small class="text-red-500" *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
              Valid email is required
            </small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="password" class="text-sm font-medium text-gray-700">Password</label>
            <p-password 
              id="password" 
              formControlName="password"
              [toggleMask]="true"
              class="w-full"
              [ngClass]="{'ng-invalid ng-dirty': registerForm.get('password')?.invalid && registerForm.get('password')?.touched}"
            ></p-password>
            <small class="text-red-500" *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
              Password is required
            </small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="role" class="text-sm font-medium text-gray-700">Role</label>
            <p-dropdown
              id="role"
              formControlName="role"
              [options]="roles"
              placeholder="Select a role"
              class="w-full"
              [ngClass]="{'ng-invalid ng-dirty': registerForm.get('role')?.invalid && registerForm.get('role')?.touched}"
            ></p-dropdown>
            <small class="text-red-500" *ngIf="registerForm.get('role')?.invalid && registerForm.get('role')?.touched">
              Role is required
            </small>
          </div>

          <div class="pt-4">
            <p-button 
              type="submit" 
              [disabled]="registerForm.invalid" 
              label="Register" 
              styleClass="w-full"
            ></p-button>
          </div>

          <div class="text-center text-sm text-gray-600">
            Already have an account? 
            <a routerLink="/auth/login" class="text-blue-600 hover:underline">Login here</a>
          </div>
        </form>
      </p-card>
    </div>
    <p-toast></p-toast>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  roles = [
    { label: 'Admin', value: 'admin' },
    { label: 'Student', value: 'student' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Registration successful'
          });
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message || 'Registration failed'
          });
        }
      });
    }
  }
}