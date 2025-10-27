import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Book, BookService } from '../../../core/services/book.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PaginatorModule } from 'primeng/paginator';
import { AuthService } from '../../../core/services/auth.service';
import { LoanService } from '../../../core/services/loan.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    ProgressSpinnerModule,
    PaginatorModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4">
        <!-- Header Section -->
        <div class="mb-12">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-4xl font-bold text-gray-800">Library Books</h1>
            <button 
              *ngIf="isAdmin"
              pButton
              label="Create Book" 
              icon="pi pi-plus"
              (click)="showCreateModal()"
              class="p-button-success text-lg px-4 py-2 h-auto"
            ></button>
          </div>

          <!-- Search Section -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              <div class="lg:col-span-5">
                <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <span class="p-input-icon-left w-full">
                  <i class="pi pi-search"></i>
                  <input 
                    type="text" 
                    pInputText 
                    [(ngModel)]="searchTitle" 
                    (ngModelChange)="onSearch()"
                    placeholder="Search by title..."
                    class="w-full p-3"
                  >
                </span>
              </div>
              <div class="lg:col-span-5">
                <label class="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <span class="p-input-icon-left w-full">
                  <i class="pi pi-user"></i>
                  <input 
                    type="text" 
                    pInputText 
                    [(ngModel)]="searchAuthor" 
                    (ngModelChange)="onSearch()"
                    placeholder="Search by author..."
                    class="w-full p-3"
                  >
                </span>
              </div>
              <div class="lg:col-span-2 flex gap-2 w-full">
                <button 
                  pButton
                  type="button"
                  label="Clear" 
                  icon="pi pi-times"
                  (click)="clearSearch()"
                  class="p-button-outlined flex-1 p-3 hover:bg-gray-50"
                ></button>
                <button 
                  pButton
                  type="button"
                  label="Search" 
                  icon="pi pi-search"
                  (click)="onSearch()"
                  class="p-button-primary flex-1 p-3"
                ></button>
              </div>
            </div>
          </div>
        </div>
      
      <!-- Loading State -->
      <div *ngIf="loading" class="text-center py-8">
        <p-progressSpinner [style]="{width: '50px', height: '50px'}"></p-progressSpinner>
        <p class="mt-4 text-gray-600">Loading books...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error && !loading" class="text-center py-8">
        <p class="text-red-500">{{ error }}</p>
        <p-button 
          label="Try Again" 
          (onClick)="loadBooks()"
          styleClass="mt-4"
        ></p-button>
      </div>

      <!-- Books Grid -->
      <div *ngIf="!loading && !error" class="card">
        <!-- No Results Message -->
        <div *ngIf="books.length === 0" class="text-center py-8">
          <i class="pi pi-book text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-600">No books found</p>
        </div>

        <!-- Books Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          <div *ngFor="let book of displayedBooks" class="book-card group">
            <p-card styleClass="h-full border border-gray-100 hover:border-primary transition-all duration-300">
              <!-- Book Cover -->
              <div class="h-48 mb-4 rounded-lg overflow-hidden bg-gray-100 group-hover:shadow-lg transition-all duration-300">
                <img 
                  src="book.png" 
                  alt="{{ book.title }}"
                  class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <!-- Book Info -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 line-clamp-2 min-h-[3rem]">{{ book.title }}</h3>
                <div class="space-y-2">
                  <p class="flex items-center text-sm text-gray-600">
                    <i class="pi pi-user mr-2 text-primary"></i>
                    {{ book.author }}
                  </p>
                  <p class="flex items-center text-sm text-gray-600">
                    <i class="pi pi-id-card mr-2 text-primary"></i>
                    ISBN: {{ book.isbn }}
                  </p>
                  <div class="pt-4 flex gap-2">
                    <button 
                      pButton 
                      type="button" 
                      label="View Details" 
                      class="p-button-outlined flex-1"
                      [routerLink]="['/books', book.id]"
                    ></button>
                    <button 
                      *ngIf="isLoggedIn && !isAdmin"
                      pButton 
                      type="button" 
                      label="Borrow" 
                      class="p-button-primary flex-1"
                      (click)="borrowBook(book)"
                    ></button>
                  </div>
                  <p class="flex items-center text-sm text-gray-600">
                    <i class="pi pi-book mr-2 text-primary"></i>
                    Available: {{ book.available_copies }} / {{ book.copies }}
                  </p>
                </div>
              </div>

              <!-- Action Buttons -->
              <ng-template pTemplate="footer">
                <div class="flex justify-center">
                  <p-button 
                    label="View Details"
                    icon="pi pi-external-link"
                    [routerLink]="['/books', book._id]"
                    styleClass="p-button-outlined w-full"
                  ></p-button>
                </div>
              </ng-template>
            </p-card>
          </div>
        </div>

        <!-- Pagination -->
        <div class="mt-8 flex justify-center">
          <p-paginator 
            [first]="first"
            [rows]="rows"
            [totalRecords]="totalRecords"
            [rowsPerPageOptions]="pageSizeOptions"
            (onPageChange)="onPageChange($event)"
            [showCurrentPageReport]="true"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} books"
            class="bg-white shadow-sm rounded-lg p-4"
          ></p-paginator>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: #f8fafc;
      min-height: 100vh;
    }
    :host ::ng-deep .p-card {
      border-radius: 1rem;
      background: #ffffff;
      transition: all 0.3s ease;
      border: 1px solid #f1f5f9;
    }
    :host ::ng-deep .p-card:hover {
      border-color: #0ea5e9;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
    }
    :host ::ng-deep .p-card .p-card-body {
      padding: 1.5rem;
    }
    :host ::ng-deep .p-inputtext {
      border-radius: 0.5rem;
      padding: 0.75rem 1rem;
      border-color: #e2e8f0;
      font-size: 0.95rem;
    }
    :host ::ng-deep .p-inputtext:hover {
      border-color: #0ea5e9;
    }
    :host ::ng-deep .p-inputtext:focus {
      border-color: #0ea5e9;
      box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2);
    }
    :host ::ng-deep .p-button {
      border-radius: 0.5rem;
      height: 2.75rem;
      font-weight: 500;
    }
    :host ::ng-deep .p-button.p-button-outlined:hover {
      background: #f1f5f9;
      border-color: #0ea5e9;
      color: #0ea5e9;
    }
    :host ::ng-deep .p-input-icon-left > i {
      left: 1rem;
      color: #64748b;
    }
    :host ::ng-deep .p-input-icon-left > input {
      padding-left: 2.5rem;
    }
    .book-card {
      transition: all 0.3s ease;
    }
    .book-card:hover {
      transform: translateY(-4px);
    }
    :host ::ng-deep .book-card img {
      transition: transform 0.5s ease;
    }
    :host ::ng-deep .book-card:hover img {
      transform: scale(1.05);
    }
    :host ::ng-deep .p-paginator {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 0.5rem;
    }
    :host ::ng-deep .p-paginator .p-paginator-current {
      font-size: 0.875rem;
      color: #6b7280;
    }
    :host ::ng-deep .p-paginator .p-paginator-pages .p-paginator-page {
      min-width: 2.5rem;
      height: 2.5rem;
      margin: 0 0.125rem;
      border-radius: 0.375rem;
    }
    :host ::ng-deep .p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
      background: #0ea5e9;
      color: white;
    }
    :host ::ng-deep .p-dropdown-panel .p-dropdown-items .p-dropdown-item.p-highlight {
      background: #0ea5e9;
      color: white;
    }
  `]
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  loading = false;
  error: string | null = null;
  isAdmin = false;
  isLoggedIn = false;

  // Search parameters
  searchTitle: string = '';
  searchAuthor: string = '';
  searchTimeout: any;

  // Pagination parameters
  first: number = 0;
  rows: number = 8;
  totalRecords: number = 0;
  pageSizeOptions: number[] = [8, 16, 24, 32];

  constructor(
    private bookService: BookService,
    private router: Router,
    private authService: AuthService,
    private loanService: LoanService,
    private messageService: MessageService
  ) {
    this.isAdmin = this.authService.isAdmin();
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    this.loadBooks();
  }

  showCreateModal(): void {
    // TODO: Implement create book functionality
    console.log('Create book modal will be implemented');
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.updateDisplayedBooks();
  }

  get displayedBooks(): Book[] {
    const start = this.first;
    const end = start + this.rows;
    return this.books.slice(start, end);
  }

  private updateDisplayedBooks(): void {
    // This method will be called after data changes
    this.totalRecords = this.books.length;
  }

  onSearch(): void {
    console.log('Search triggered with:', { title: this.searchTitle, author: this.searchAuthor });
    // Clear any existing timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Set a new timeout to prevent too many API calls
    this.searchTimeout = setTimeout(() => {
      this.loadBooks();
    }, 400);
  }

  clearSearch(): void {
    console.log('Clearing search');
    this.searchTitle = '';
    this.searchAuthor = '';
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.error = null;
    
    // Create search params object only if there are non-empty values
    const searchParams: any = {};
    if (this.searchTitle?.trim()) searchParams.title = this.searchTitle.trim();
    if (this.searchAuthor?.trim()) searchParams.author = this.searchAuthor.trim();
    
    console.log('Loading books with params:', searchParams);
    
    this.bookService.getAllBooks(searchParams).subscribe({
      next: (books) => {
        if (Array.isArray(books)) {
          this.books = books;
          this.totalRecords = books.length;
          this.first = 0; // Reset to first page when new data is loaded
          console.log('Loaded books:', books);
        } else {
          console.error('Received non-array response:', books);
          this.error = 'Invalid data format received from server';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading books:', error);
        this.error = error.message || 'An error occurred while loading books';
        this.loading = false;
        
        if (error.message?.includes('not authorized')) {
          this.router.navigate(['/auth/login']);
        }
      }
    });
  }
}