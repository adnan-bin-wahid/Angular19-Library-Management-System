import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { User } from '../../../core/services/auth.service';

@Component({
  selector: 'app-update-profile-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule
  ],
  styles: [`
    :host ::ng-deep .p-dialog .p-dialog-header {
      padding: 0 !important;
      border: none !important;
      background: transparent !important;
    }
    
    :host ::ng-deep .p-dialog .p-dialog-content {
      padding: 0 !important;
    }
  `],
  template: `
    <p-dialog 
      [(visible)]="visible" 
      [modal]="true" 
      [style]="{ width: '550px' }"
      [contentStyle]="{ padding: '0', 'border-radius': '1rem', 'overflow': 'hidden' }"
      [closeOnEscape]="true"
      [closable]="false"
      [draggable]="false"
      [resizable]="false"
      (onHide)="onHide()"
    >
      <ng-template pTemplate="header">
        <div class="w-full bg-gradient-to-r from-green-500 via-purple-300 to-pink-50 p-6 relative rounded-t-2xl">
          <!-- Close Button Inside Gradient -->
          <button
            type="button"
            (click)="onHide()"
            class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white text-indigo-600 backdrop-blur-sm flex items-center justify-center  hover:bg-white/30 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Close"
          >
            <i class="pi pi-times text-xl"></i>
          </button>
          
          <div class="flex items-center gap-3 text-white pr-12">
            <div class="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <i class="pi pi-user-edit text-2xl"></i>
            </div>
            <div>
              <h3 class="text-2xl font-bold">Update Profile</h3>
              <p class="text-sm text-white/90">Edit your account information</p>
            </div>
          </div>
        </div>
      </ng-template>

      <form [formGroup]="updateForm" (ngSubmit)="onSubmit()" class="p-6 space-y-6">
        <!-- Name Field -->
        <div class="space-y-2">
          <label for="name" class="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            <i class="pi pi-user text-indigo-500"></i>
            Full Name
          </label>
          <input 
            id="name" 
            type="text" 
            pInputText 
            formControlName="name"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
            placeholder="Enter your full name"
          />
          <div *ngIf="updateForm.get('name')?.invalid && updateForm.get('name')?.touched" class="text-red-500 text-sm mt-1">
            <i class="pi pi-exclamation-circle"></i> Name is required
          </div>
        </div>

        <!-- Role Field -->
        <div class="space-y-2">
          <label for="role" class="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            <i class="pi pi-shield text-purple-500"></i>
            Role
          </label>
          <p-dropdown
            id="role"
            formControlName="role"
            [options]="roles"
            optionLabel="label"
            optionValue="value"
            placeholder="Select your role"
            [style]="{ width: '100%' }"
            styleClass="w-full"
          ></p-dropdown>
          <div *ngIf="updateForm.get('role')?.invalid && updateForm.get('role')?.touched" class="text-red-500 text-sm mt-1">
            <i class="pi pi-exclamation-circle"></i> Role is required
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            (click)="onHide()"
            class="px-6 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            [disabled]="updateForm.invalid || updateForm.pristine"
            [class.opacity-50]="updateForm.invalid || updateForm.pristine"
            [class.cursor-not-allowed]="updateForm.invalid || updateForm.pristine"
            class="px-6 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:transform-none disabled:hover:shadow-lg flex items-center gap-2"
          >
            <i class="pi pi-check"></i>
            Save Changes
          </button>
        </div>
      </form>
    </p-dialog>
  `
})
export class UpdateProfileModalComponent {
  @Input() visible = false;
  @Input() user: User | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() userUpdated = new EventEmitter<{ name: string; role: string }>();

  updateForm: FormGroup;
  roles = [
    { label: 'Admin', value: 'admin' },
    { label: 'Student', value: 'student' }
  ];

  constructor(private fb: FormBuilder) {
    this.updateForm = this.fb.group({
      name: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  ngOnChanges(): void {
    if (this.user) {
      this.updateForm.patchValue({
        name: this.user.name,
        role: this.user.role
      });
    }
  }

  onSubmit(): void {
    if (this.updateForm.valid && this.updateForm.dirty) {
      this.userUpdated.emit(this.updateForm.value);
      this.onHide();
    }
  }

  onHide(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.updateForm.reset();
  }
}