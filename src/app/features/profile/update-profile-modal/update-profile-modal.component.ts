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
  template: `
    <p-dialog 
      [(visible)]="visible" 
      [modal]="true" 
      [style]="{ width: '450px' }" 
      header="Update Profile"
      [closeOnEscape]="true"
      [closable]="true"
      (onHide)="onHide()"
    >
      <form [formGroup]="updateForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <div class="flex flex-col gap-2">
          <label for="name" class="text-sm font-medium text-gray-700">Name</label>
          <input 
            id="name" 
            type="text" 
            pInputText 
            formControlName="name"
            class="w-full"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="role" class="text-sm font-medium text-gray-700">Role</label>
          <p-dropdown
            id="role"
            formControlName="role"
            [options]="roles"
            optionLabel="label"
            optionValue="value"
            placeholder="Select a role"
            class="w-full"
          ></p-dropdown>
        </div>

        <div class="flex justify-end gap-2 pt-4">
          <p-button 
            type="button" 
            label="Cancel" 
            styleClass="p-button-text" 
            (onClick)="onHide()"
          ></p-button>
          <p-button 
            type="submit" 
            label="Save" 
            [disabled]="updateForm.invalid || updateForm.pristine"
          ></p-button>
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