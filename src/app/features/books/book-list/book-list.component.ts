import { Component, OnInit, ViewChild } from '@angular/core';
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
import { CreateBookModalComponent } from '../create-book-modal/create-book-modal.component';

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
    ToastModule,
    CreateBookModalComponent
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <app-create-book-modal #createBookModal></app-create-book-modal>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div class="container mx-auto px-4">
        <!-- Header Section -->
        <div class="mb-8">
          <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Library Books
                </h1>
                <p class="text-gray-600">Discover and borrow from our collection</p>
              </div>
              <div class="flex gap-3">
                <button 
                  *ngIf="isLoggedIn && !isAdmin"
                  pButton
                  label="My Loans" 
                  icon="pi pi-bookmark"
                  routerLink="/my-loans"
                  class="p-button-rounded bg-gradient-to-r from-blue-500 to-blue-600 border-none shadow-md hover:shadow-lg transition-all"
                ></button>
                <button 
                  *ngIf="isAdmin"
                  pButton
                  label="Create Book" 
                  icon="pi pi-plus"
                  (click)="showCreateModal()"
                  class="p-button-rounded bg-gradient-to-r from-green-500 to-green-600 border-none shadow-md hover:shadow-lg transition-all"
                ></button>
              </div>
            </div>

            <!-- Search Section -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              <div class="lg:col-span-5">
                <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <i class="pi pi-search text-indigo-500"></i>
                  Search by Title
                </label>
                <span class="p-input-icon-left w-full">
                  <input 
                    type="text" 
                    pInputText 
                    [(ngModel)]="searchTitle" 
                    (ngModelChange)="onSearch()"
                    placeholder="Enter book title..."
                    class="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 transition-all"
                  >
                </span>
              </div>
              <div class="lg:col-span-5">
                <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <i class="pi pi-user text-purple-500"></i>
                  Search by Author
                </label>
                <span class="p-input-icon-left w-full">
                  <input 
                    type="text" 
                    pInputText 
                    [(ngModel)]="searchAuthor" 
                    (ngModelChange)="onSearch()"
                    placeholder="Enter author name..."
                    class="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 transition-all"
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
                  class="p-button-outlined p-button-rounded flex-1 hover:bg-gray-100 transition-all"
                ></button>
                <button 
                  pButton
                  type="button"
                  label="Search" 
                  icon="pi pi-search"
                  (click)="onSearch()"
                  class="p-button-rounded flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 border-none shadow-md hover:shadow-lg transition-all"
                ></button>
              </div>
            </div>
          </div>
        </div>
      
      <!-- Loading State -->
      <div *ngIf="loading" class="text-center py-16">
        <div class="bg-white rounded-2xl shadow-lg p-12 inline-block">
          <p-progressSpinner [style]="{width: '60px', height: '60px'}" styleClass="custom-spinner"></p-progressSpinner>
          <p class="mt-6 text-gray-600 font-medium">Loading amazing books...</p>
        </div>
      </div>

      <!-- Error State -->
      <div *ngIf="error && !loading" class="text-center py-16">
        <div class="bg-white rounded-2xl shadow-lg p-12 inline-block">
          <i class="pi pi-exclamation-circle text-6xl text-red-500 mb-4"></i>
          <p class="text-red-600 font-medium mb-4">{{ error }}</p>
          <p-button 
            label="Try Again" 
            icon="pi pi-refresh"
            (onClick)="loadBooks()"
            styleClass="p-button-rounded"
          ></p-button>
        </div>
      </div>

      <!-- Books Grid -->
      <div *ngIf="!loading && !error">
        <!-- No Results Message -->
        <div *ngIf="books.length === 0" class="text-center py-16">
          <div class="bg-white rounded-2xl shadow-lg p-12 inline-block">
            <i class="pi pi-book text-6xl text-gray-300 mb-4"></i>
            <p class="text-gray-600 font-medium text-lg">No books found</p>
            <p class="text-gray-500 text-sm mt-2">Try adjusting your search criteria</p>
          </div>
        </div>

        <!-- Books Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          <div *ngFor="let book of displayedBooks" class="group">
            <div class="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col transform hover:-translate-y-2">
              <!-- Book Cover -->
              <div class="relative h-56 overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
                <img 
                  src="book.png" 
                  alt="{{ book.title }}"
                  class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
                  <span class="text-xs font-semibold text-indigo-600">
                    <i class="pi pi-book mr-1"></i>
                    {{ book.available_copies }}/{{ book.copies }}
                  </span>
                </div>
              </div>
              
              <!-- Book Info -->
              <div class="p-5 flex-grow flex flex-col">
                <h3 class="text-lg font-bold text-gray-800 line-clamp-2 min-h-[3.5rem] mb-3 group-hover:text-indigo-600 transition-colors">
                  {{ book.title }}
                </h3>
                
                <div class="space-y-2 mb-4 flex-grow">
                  <div class="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                    <i class="pi pi-user mr-2 text-purple-500"></i>
                    <span class="font-medium">{{ book.author }}</span>
                  </div>
                  <div class="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                    <i class="pi pi-id-card mr-2 text-blue-500"></i>
                    <span>ISBN: {{ book.isbn }}</span>
                  </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="flex gap-2 mt-auto">
                  <button 
                    pButton 
                    type="button" 
                    label="Details" 
                    icon="pi pi-external-link"
                    class="p-button-outlined p-button-rounded flex-1 text-sm"
                    [routerLink]="['/books', book._id]"
                  ></button>
                  <button 
                    *ngIf="isLoggedIn && !isAdmin"
                    pButton 
                    type="button" 
                    label="Borrow" 
                    icon="pi pi-bookmark"
                    class="p-button-rounded flex-1 text-sm bg-gradient-to-r from-indigo-600 to-purple-600 border-none"
                    (click)="borrowBook(book)"
                    [disabled]="book.available_copies === 0"
                  ></button>
                </div>
              </div>
            </div>
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
    this.isLoggedIn = !!this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadBooks();
  }

  borrowBook(book: Book): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please log in to borrow books'
      });
      return;
    }

    // Calculate due date as 30 days from now
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    const loanRequest = {
      user_id: currentUser.id,
      book_id: book._id,
      due_date: dueDate.toISOString()
    };

    this.loanService.issueLoan(loanRequest).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Successfully borrowed "${book.title}". Due date: ${new Date(response.due_date).toLocaleDateString()}`
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to borrow the book. Please try again.'
        });
      }
    });
  }

  @ViewChild('createBookModal') createBookModal!: CreateBookModalComponent;

  showCreateModal(): void {
    this.createBookModal.visible = true;
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