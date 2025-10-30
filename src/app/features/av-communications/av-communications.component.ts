import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Communication {
  _id: string;
  fileName: string;
  campaign: string;
  createdBy: string;
  createdAt: string;
  description: string;
}

@Component({
  selector: 'app-av-communications',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TableModule, ButtonModule, InputTextModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-4">
        <div class="p-input-icon-left w-96">
          <i class="pi pi-search"></i>
          <input 
            type="text" 
            pInputText 
            class="w-full" 
            placeholder="Search communications..."
            [(ngModel)]="searchText"
            (input)="onSearch($event)"
          />
        </div>
          <button 
            pButton 
            label="Create New" 
            icon="pi pi-plus" 
            class="p-button-primary"
            (click)="router.navigate(['/av-communications/create'])"
          ></button>
      </div>

      <p-table 
        [value]="communications" 
        [paginator]="true" 
        [rows]="10"
        [showCurrentPageReport]="true"
        [tableStyle]="{ 'min-width': '50rem' }"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        [rowsPerPageOptions]="[10,25,50]"
      >
        <ng-template pTemplate="header">
          <tr>
            <th>SL</th>
            <th>File Name</th>
            <th>Campaign</th>
            <th>Created By</th>
            <th>Created At</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-communication let-i="rowIndex">
          <tr>
            <td>{{i + 1}}</td>
            <td>{{communication.fileName}}</td>
            <td>{{communication.campaign}}</td>
            <td>{{communication.createdBy}}</td>
            <td>{{communication.createdAt | date:'medium'}}</td>
            <td>{{communication.description}}</td>
            <td>
              <button 
                pButton 
                icon="pi pi-eye" 
                class="p-button-rounded p-button-text"
                (click)="router.navigate(['/av-communications/view', communication._id])"
              ></button>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-datatable .p-datatable-header {
      background: transparent;
      border: none;
      padding: 0;
    }
    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      background: #f8f9fa;
      color: #343a40;
      font-weight: 600;
      padding: 1rem;
    }
    :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
      padding: 1rem;
    }
  `]
})
export class AvCommunicationsComponent implements OnInit {
  private http = inject(HttpClient);
  protected router = inject(Router);
  communications: Communication[] = [];
  searchText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;

  ngOnInit() {
    this.loadCommunications();
  }

  loadCommunications() {
    const url = `http://localhost:4000/api/communications?page=${this.currentPage}&limit=${this.itemsPerPage}${this.searchText ? '&search=' + this.searchText : ''}`;
    this.http.get<Communication[]>(url).subscribe(data => {
      this.communications = data;
    });
  }

  onSearch(event: any) {
    this.currentPage = 1;
    this.loadCommunications();
  }
}