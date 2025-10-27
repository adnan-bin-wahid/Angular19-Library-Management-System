import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, tap, map } from 'rxjs';

export interface RawBookResponse {
  id: string;
  title: 'this';
  author: 'no';
  isbn: string;
  copies: number;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  copies: number;
  available_copies: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface CreateBookDto {
  title: string;
  author: string;
  isbn: string;
  copies: number;
  available_copies: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:4000/api/books';

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    if (error.status === 403) {
      return throwError(() => new Error('You are not authorized to access this resource. Please log in again.'));
    }
    const errorMessage = error.error?.message || 'An error occurred. Please try again later.';
    return throwError(() => new Error(errorMessage));
  }

  getAllBooks(params?: { title?: string; author?: string }): Observable<Book[]> {
    let url = `${this.apiUrl}/getBooks`;
    
    // Only add search parameters if they have actual values (not empty strings)
    if (params) {
      const queryParams: string[] = [];
      if (params.title?.trim()) queryParams.push(`title=${encodeURIComponent(params.title.trim())}`);
      if (params.author?.trim()) queryParams.push(`author=${encodeURIComponent(params.author.trim())}`);
      if (queryParams.length > 0) {
        url += '?' + queryParams.join('&');
      }
    }

    console.log('Calling API with URL:', url); // Debug log
    
    return this.http.get<any>(url).pipe(
      tap(response => {
        console.log('Raw API Response:', response);
        if (!Array.isArray(response)) {
          console.warn('API response is not an array:', response);
        }
      }),
      map(response => {
        // Ensure we're working with an array
        const booksArray = Array.isArray(response) ? response : [];
        console.log('Books array before mapping:', booksArray);
        
        return booksArray.map((book: any) => ({
          _id: book._id,
          title: book.title || '',
          author: book.author || '',
          isbn: book.isbn || '',
          copies: book.copies || 0,
          available_copies: book.available_copies || 0,
          createdAt: book.createdAt || '',
          updatedAt: book.updatedAt || ''
        }));
      }),
      tap(mappedBooks => console.log('Final mapped books:', mappedBooks)),
      catchError(error => {
        console.error('Error fetching books:', error);
        return this.handleError(error);
      })
    );
  }

  getBookById(id: string): Observable<Book> {
    console.log('Fetching book with ID:', id);
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      tap(response => console.log('Book detail response:', response)),
      map(book => ({
        _id: book._id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        copies: book.copies,
        available_copies: book.available_copies,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt
      })),
      catchError(error => this.handleError(error))
    );
  }

  createBook(book: CreateBookDto): Observable<Book> {
    return this.http.post<Book>(`${this.apiUrl}/addBook`, book).pipe(
      catchError(error => this.handleError(error))
    );
  }
}