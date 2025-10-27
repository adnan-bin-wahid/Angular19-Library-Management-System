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
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <p-card class="w-full max-w-md">
        <h2 class="mb-6 text-center text-2xl font-bold text-gray-800">Login</h2>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="flex flex-col gap-2">
            <label for="email" class="text-sm font-medium text-gray-700">Email</label>
            <input 
              id="email" 
              type="email" 
              pInputText 
              formControlName="email"
              class="w-full"
              [ngClass]="{'ng-invalid ng-dirty': loginForm.get('email')?.invalid && loginForm.get('email')?.touched}"
            />
            <small class="text-red-500" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
              Valid email is required
            </small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="password" class="text-sm font-medium text-gray-700">Password</label>
            <p-password 
              id="password" 
              formControlName="password"
              [feedback]="false"
              [toggleMask]="true"
              class="w-full"
              [ngClass]="{'ng-invalid ng-dirty': loginForm.get('password')?.invalid && loginForm.get('password')?.touched}"
            ></p-password>
            <small class="text-red-500" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              Password is required
            </small>
          </div>

          <div class="pt-4">
            <p-button 
              type="submit" 
              [disabled]="loginForm.invalid" 
              label="Login" 
              styleClass="w-full"
            ></p-button>
          </div>

          <div class="text-center text-sm text-gray-600">
            Don't have an account? 
            <a routerLink="/auth/register" class="text-blue-600 hover:underline">Register here</a>
          </div>
        </form>
      </p-card>
    </div>
    <p-toast></p-toast>
  `
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message || 'Login failed'
          });
        }
      });
    }
  }
}