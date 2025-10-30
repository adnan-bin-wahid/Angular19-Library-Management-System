import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-create-communication',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule,
    InputTextModule,
    InputTextarea,
    ButtonModule,
    CardModule
  ],
  template: `
    <div class="container mx-auto p-4">
      <div class="max-w-3xl mx-auto">
        <p-card>
          <ng-template pTemplate="header">
            <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 rounded-t-lg">
              <h2 class="text-white text-xl font-semibold">Create New AV Communication</h2>
            </div>
          </ng-template>

          <div class="p-4">
            <form #form="ngForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <!-- File Upload -->
              <div class="w-full">
                <p-fileUpload
                  #fileUpload
                  [showUploadButton]="false"
                  [showCancelButton]="false"
                  (onSelect)="onFileSelect($event)"
                  [maxFileSize]="50000000"
                  [multiple]="false"
                  accept="audio/*,video/*"
                  [styleClass]="'w-full'"
                  chooseLabel="Choose or Drag & Drop File"
                >
                  <ng-template pTemplate="content">
                    <div class="flex items-center flex-col gap-4" *ngIf="!selectedFile">
                      <i class="pi pi-file text-4xl opacity-60"></i>
                      <span class="opacity-75">Drag and drop file here or click to select</span>
                    </div>
                    <div *ngIf="selectedFile" class="flex items-center gap-2 opacity-75">
                      <i class="pi" [ngClass]="{'pi-file-video': isVideo, 'pi-file-audio': !isVideo}"></i>
                      <span>{{ selectedFile.name }}</span>
                      <button 
                        type="button" 
                        pButton 
                        icon="pi pi-times" 
                        (click)="clearFile(fileUpload)" 
                        class="p-button-rounded p-button-text p-button-danger"
                      ></button>
                    </div>
                  </ng-template>
                </p-fileUpload>
              </div>

              <!-- Campaign -->
              <div class="w-full">
                <span class="p-float-label">
                  <input 
                    id="campaign" 
                    type="text" 
                    pInputText 
                    class="w-full" 
                    [(ngModel)]="formData.campaign"
                    name="campaign"
                    required
                    #campaign="ngModel"
                  >
                  <label for="campaign">Campaign</label>
                </span>
                <small class="text-red-400" *ngIf="campaign.invalid && campaign.touched">
                  Campaign is required
                </small>
              </div>

              <!-- Brand -->
              <div class="w-full">
                <span class="p-float-label">
                  <input 
                    id="brand" 
                    type="text" 
                    pInputText 
                    class="w-full" 
                    [(ngModel)]="formData.brand"
                    name="brand"
                    required
                    #brand="ngModel"
                  >
                  <label for="brand">Brand</label>
                </span>
                <small class="text-red-400" *ngIf="brand.invalid && brand.touched">
                  Brand is required
                </small>
              </div>

              <!-- Description -->
              <div class="w-full">
                <span class="p-float-label">
                  <textarea 
                    id="description" 
                    pInputTextarea 
                    class="w-full" 
                    [(ngModel)]="formData.description"
                    name="description"
                    [rows]="3"
                    required
                    #description="ngModel"
                  ></textarea>
                  <label for="description">Description</label>
                </span>
                <small class="text-red-400" *ngIf="description.invalid && description.touched">
                  Description is required
                </small>
              </div>

              <!-- Submit Button -->
              <div class="flex justify-end gap-2">
                <button 
                  pButton 
                  type="button" 
                  label="Cancel" 
                  class="p-button-outlined"
                  (click)="goBack()"
                ></button>
                <button 
                  pButton 
                  type="submit" 
                  label="Create" 
                  [disabled]="form.invalid || !selectedFile"
                  [loading]="isSubmitting"
                ></button>
              </div>
            </form>
          </div>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-fileupload {
      .p-fileupload-content {
        border: 2px dashed #cbd5e1;
        background-color: #f8fafc;
      }
    }
  `]
})
export class CreateCommunicationComponent {
  private http = inject(HttpClient);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);

  selectedFile: File | null = null;
  isVideo = false;
  isSubmitting = false;

  formData = {
    campaign: '',
    brand: '',
    description: '',
    createdBy: JSON.parse(localStorage.getItem('user') || '{}')?.name || 'Unknown'
  };

  onFileSelect(event: any) {
    this.selectedFile = event.files[0];
    this.isVideo = this.selectedFile?.type.startsWith('video/') || false;
  }

  clearFile(fileUpload: any) {
    this.selectedFile = null;
    fileUpload.clear();
  }

  goBack() {
    this.router.navigate(['/av-communications']);
  }

  onSubmit() {
    if (!this.selectedFile) return;

    this.isSubmitting = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('campaign', this.formData.campaign);
    formData.append('brand', this.formData.brand);
    formData.append('description', this.formData.description);
    formData.append('createdBy', this.formData.createdBy);

    this.http.post('http://localhost:4000/api/communications', formData)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Communication created successfully'
          });
          this.router.navigate(['/av-communications']);
        },
        error: (error) => {
          this.isSubmitting = false;
          // Error will be handled by the error interceptor
        }
      });
  }
}