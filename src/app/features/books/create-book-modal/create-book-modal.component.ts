import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { BookService, CreateBookDto } from '../../../core/services/book.service';

@Component({
  selector: 'app-create-book-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule
  ],
  template: `
    <p-dialog 
      [(visible)]="visible" 
      [modal]="true" 
      [style]="{width: '450px'}" 
      header="Create New Book"
      [closable]="true"
      [closeOnEscape]="true"
      (onHide)="onClose()"
    >
      <div class="flex flex-col gap-4">
        <div class="field">
          <label for="title" class="block mb-2">Title</label>
          <input 
            type="text" 
            pInputText 
            id="title" 
            [(ngModel)]="book.title" 
            class="w-full"
            placeholder="Enter book title"
          >
        </div>

        <div class="field">
          <label for="author" class="block mb-2">Author</label>
          <input 
            type="text" 
            pInputText 
            id="author" 
            [(ngModel)]="book.author" 
            class="w-full"
            placeholder="Enter author name"
          >
        </div>

        <div class="field">
          <label for="isbn" class="block mb-2">ISBN</label>
          <input 
            type="text" 
            pInputText 
            id="isbn" 
            [(ngModel)]="book.isbn" 
            class="w-full"
            placeholder="Enter ISBN"
          >
        </div>

        <div class="field">
          <label for="copies" class="block mb-2">Total Copies</label>
          <p-inputNumber 
            id="copies" 
            [(ngModel)]="book.copies" 
            [showButtons]="true"
            [min]="1"
            class="w-full"
          ></p-inputNumber>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <div class="flex justify-end gap-2">
          <p-button 
            label="Cancel" 
            (onClick)="onClose()" 
            styleClass="p-button-text"
          ></p-button>
          <p-button 
            label="Create" 
            (onClick)="onCreate()"
            [loading]="loading"
          ></p-button>
        </div>
      </ng-template>
    </p-dialog>
  `
})
export class CreateBookModalComponent {
  visible = false;
  loading = false;

  book: CreateBookDto = {
    title: '',
    author: '',
    isbn: '',
    copies: 1,
    available_copies: 0
  };

  constructor(private bookService: BookService) {}

  show(): void {
    this.visible = true;
  }

  onClose(): void {
    this.visible = false;
    this.resetForm();
  }

  onCreate(): void {
    this.loading = true;
    // Set available copies equal to total copies initially
    this.book.available_copies = this.book.copies;
    
    this.bookService.createBook(this.book).subscribe({
      next: (createdBook) => {
        console.log('Book created:', createdBook);
        this.loading = false;
        this.onClose();
        // TODO: Emit event to refresh book list
      },
      error: (error) => {
        console.error('Error creating book:', error);
        this.loading = false;
      }
    });
  }

  private resetForm(): void {
    this.book = {
      title: '',
      author: '',
      isbn: '',
      copies: 1,
      available_copies: 0
    };
  }
}