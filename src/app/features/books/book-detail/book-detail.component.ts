import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Book, BookService } from '../../../core/services/book.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    ProgressSpinnerModule
  ],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">
          <p-card *ngIf="book" [style]="{ 'background': '#ffffff', 'min-height': '80vh' }">
            <h1 class="text-3xl font-semibold mb-8 text-gray-800">Book Details</h1>
            
            <div class="flex flex-col md:flex-row gap-12">
              <!-- Book Cover -->
              <div class="w-full md:w-96 h-[500px] rounded-lg overflow-hidden shadow-xl">
                <img 
                  [src]="'book.png'" 
                  [alt]="book.title"
                  class="w-full h-full object-cover"
                >
              </div>

            <!-- Book Information -->
            <div class="flex-1 space-y-8">
              <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ book.title }}</h2>
              </div>

              <div class="space-y-6">
                <div class="flex items-center border-b border-gray-200 pb-4">
                  <span class="w-48 text-gray-600 text-lg">Author:</span>
                  <span class="text-gray-900 text-lg">{{ book.author }}</span>
                </div>

                <div class="flex items-center border-b border-gray-200 pb-4">
                  <span class="w-48 text-gray-600 text-lg">ISBN:</span>
                  <span class="text-gray-900 text-lg">{{ book.isbn }}</span>
                </div>

                <div class="flex items-center border-b border-gray-200 pb-4">
                  <span class="w-48 text-gray-600 text-lg">Genre:</span>
                  <span class="text-gray-900 text-lg">Fantasy</span>
                </div>

                <div class="flex items-center border-b border-gray-200 pb-4">
                  <span class="w-48 text-gray-600 text-lg">Copies:</span>
                  <span class="text-gray-900 text-lg">{{ book.copies }}</span>
                </div>

                <div class="flex items-center border-b border-gray-200 pb-4">
                  <span class="w-48 text-gray-600 text-lg">Available Copies:</span>
                  <span class="text-gray-900 text-lg">{{ book.available_copies }}</span>
                </div>
              </div>

              <div class="pt-8 space-y-4">
                <button 
                  pButton 
                  label="Borrow Book"
                  class="p-button-success w-full text-lg py-3"
                ></button>
                <button 
                  pButton 
                  label="Back to Books"
                  class="p-button-outlined p-button-secondary w-full text-lg py-3"
                  routerLink="/books"
                ></button>
              </div>
            </div>
          </div>
        </p-card>

        <div *ngIf="!book" class="text-center py-8">
          <p-progressSpinner [style]="{width: '50px', height: '50px'}"></p-progressSpinner>
          <p class="mt-4 text-gray-600">Loading book details...</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
    :host ::ng-deep .p-card {
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    }
    :host ::ng-deep .p-card .p-card-body {
      padding: 2.5rem;
    }
    :host ::ng-deep .p-button {
      border-radius: 0.5rem;
      height: auto;
      min-height: 3rem;
    }
    :host ::ng-deep .p-button .p-button-label {
      font-weight: 600;
    }
  `]
})
export class BookDetailComponent implements OnInit {
  book: Book | null = null;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        console.log('Route parameter ID:', params['id']);
        this.loadBook(params['id']);
      }
    });
  }

  loadBook(id: string): void {
    console.log('Loading book with ID:', id);
    this.bookService.getBookById(id).subscribe({
      next: (book) => {
        this.book = book;
      },
      error: (error) => {
        console.error('Error loading book:', error);
      }
    });
  }
}