import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';

interface Communication {
  _id: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSizeMb: number;
  campaign: string;
  brand: string;
  createdBy: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}



@Component({
  selector: 'app-view-communication',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    DialogModule,
    InputTextModule,
    InputTextarea,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService],
  template: `
    <div class="container mx-auto p-4">
      <div class="max-w-4xl mx-auto">
        <p-card>
          <ng-template pTemplate="header">
            <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 rounded-t-lg">
              <div class="flex justify-between items-center">
                <h2 class="text-white text-xl font-semibold">View Communication</h2>
                <div class="flex gap-2">
                  <button 
                    pButton 
                    icon="pi pi-pencil" 
                    label="Edit" 
                    class="p-button-secondary"
                    (click)="showEditDialog()"
                  ></button>
                  <button 
                    pButton 
                    icon="pi pi-trash" 
                    label="Delete" 
                    class="p-button-danger"
                    (click)="confirmDelete()"
                  ></button>
                </div>
              </div>
            </div>
          </ng-template>

          <div class="space-y-6" *ngIf="communication">
            <!-- Media Player -->
            <div class="w-full aspect-video bg-black/5 rounded-lg overflow-hidden flex items-center justify-center">
              <video 
                *ngIf="isVideo" 
                [src]="mediaUrl" 
                controls 
                class="w-full h-full"
              >
                Your browser does not support the video tag.
              </video>
              <audio 
                *ngIf="!isVideo" 
                [src]="mediaUrl" 
                controls 
                class="w-full"
              >
                Your browser does not support the audio tag.
              </audio>
            </div>

            <!-- Details -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm opacity-75">File Name</label>
                <p class="font-medium">{{communication.fileName}}</p>
              </div>
              <div>
                <label class="text-sm opacity-75">File Size</label>
                <p class="font-medium">{{communication.fileSizeMb}} MB</p>
              </div>
              <div>
                <label class="text-sm opacity-75">Campaign</label>
                <p class="font-medium">{{communication.campaign}}</p>
              </div>
              <div>
                <label class="text-sm opacity-75">Brand</label>
                <p class="font-medium">{{communication.brand}}</p>
              </div>
              <div>
                <label class="text-sm opacity-75">Created By</label>
                <p class="font-medium">{{communication.createdBy}}</p>
              </div>
              <div>
                <label class="text-sm opacity-75">Created At</label>
                <p class="font-medium">{{communication.createdAt | date:'medium'}}</p>
              </div>
              <div class="col-span-2">
                <label class="text-sm opacity-75">Description</label>
                <p class="font-medium">{{communication.description}}</p>
              </div>
            </div>
          </div>
        </p-card>
      </div>
    </div>

    <!-- Edit Dialog -->
    <p-dialog 
      [(visible)]="showDialog" 
      [modal]="true" 
      [style]="{width: '450px'}" 
      header="Edit Communication"
      [draggable]="false"
      [resizable]="false"
    >
      <form #editForm="ngForm" (ngSubmit)="updateCommunication()" class="space-y-4" *ngIf="editData">
        <div class="field">
          <label for="campaign" class="block mb-1">Campaign</label>
          <input 
            id="campaign" 
            type="text" 
            pInputText 
            class="w-full" 
            [(ngModel)]="editData.campaign"
            name="campaign"
            required
            #campaign="ngModel"
          >
          <small class="text-red-400" *ngIf="campaign.invalid && campaign.touched">
            Campaign is required
          </small>
        </div>

        <div class="field">
          <label for="brand" class="block mb-1">Brand</label>
          <input 
            id="brand" 
            type="text" 
            pInputText 
            class="w-full" 
            [(ngModel)]="editData.brand"
            name="brand"
            required
            #brand="ngModel"
          >
          <small class="text-red-400" *ngIf="brand.invalid && brand.touched">
            Brand is required
          </small>
        </div>

        <div class="field">
          <label for="description" class="block mb-1">Description</label>
          <textarea 
            id="description" 
            pInputTextarea 
            class="w-full" 
            [(ngModel)]="editData.description"
            name="description"
            [rows]="3"
            required
            #description="ngModel"
          ></textarea>
          <small class="text-red-400" *ngIf="description.invalid && description.touched">
            Description is required
          </small>
        </div>
      </form>

      <ng-template pTemplate="footer">
        <button 
          pButton 
          label="Cancel" 
          icon="pi pi-times" 
          class="p-button-text" 
          (click)="showDialog = false"
        ></button>
        <button 
          pButton 
          label="Save" 
          icon="pi pi-check" 
          class="p-button-text" 
          (click)="updateCommunication()"
          [disabled]="!editForm.valid"
        ></button>
      </ng-template>
    </p-dialog>

    <!-- Confirmation Dialog -->
    <p-confirmDialog 
      header="Confirm Delete" 
      icon="pi pi-exclamation-triangle"
      [draggable]="false"
    ></p-confirmDialog>
  `
})
export class ViewCommunicationComponent implements OnInit {
  @ViewChild('editForm') editForm!: NgForm;
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  communication: Communication | null = null;
  showDialog = false;
  editData: any = null;
  isVideo = false;
  mediaUrl = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCommunication(id);
    }
  }

  loadCommunication(id: string) {
    this.http.get<Communication>(`http://localhost:4000/api/communications/${id}`).subscribe({
      next: (data) => {
        this.communication = data;
        this.isVideo = this.communication.fileName.toLowerCase().endsWith('.mp4');
        // Use the direct file URL from the backend
        this.mediaUrl = `http://localhost:4000${this.communication.filePath}`;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load communication'
        });
        this.router.navigate(['/av-communications']);
      }
    });
  }

  showEditDialog() {
    if (this.communication) {
      this.editData = {
        campaign: this.communication.campaign,
        brand: this.communication.brand,
        description: this.communication.description
      };
      this.showDialog = true;
    }
  }

  updateCommunication() {
    if (!this.communication || !this.editData || !this.editForm.valid) return;

    this.http.put<Communication>(`http://localhost:4000/api/communications/${this.communication._id}`, this.editData)
      .subscribe({
        next: (response) => {
          this.communication = response;
          this.showDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Communication updated successfully'
          });
        }
      });
  }

  confirmDelete() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this communication?',
      accept: () => {
        if (!this.communication) return;

        this.http.delete(`http://localhost:4000/api/communications/${this.communication._id}`)
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Communication deleted successfully'
              });
              this.router.navigate(['/av-communications']);
            }
          });
      }
    });
  }
}