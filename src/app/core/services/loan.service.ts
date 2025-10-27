import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoanRequest {
  user_id: string;
  book_id: string;
  due_date: string;
}

export interface LoanBook {
  id: string;
  title: string;
  author: string;
}

export interface Loan {
  id: string;
  book: LoanBook;
  issue_date: string;
  due_date: string;
  return_date: string | null;
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
}

export interface LibraryOverview {
  total_books: number;
  total_users: number;
  books_available: number;
  books_borrowed: number;
  overdue_loans: number;
  loans_today: number;
  returns_today: number;
}

export interface ActiveUser {
  user_id: string;
  name: string;
  books_borrowed: number;
  current_borrows: number;
}

export interface PopularBook {
  book_id: string;
  title: string;
  author: string;
  borrow_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = `${environment.apiUrl}/loans`;

  constructor(private http: HttpClient) { }

  issueLoan(loanRequest: LoanRequest): Observable<Loan> {
    return this.http.post<Loan>(`${this.apiUrl}/issueBook`, loanRequest);
  }

  getUserLoans(userId: string): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/${userId}`);
  }

  returnBook(loanId: string): Observable<Loan> {
    return this.http.post<Loan>(`${this.apiUrl}/returns`, { loan_id: loanId });
  }

  extendLoan(loanId: string, extensionDays: number): Observable<Loan> {
    return this.http.put<Loan>(`${this.apiUrl}/${loanId}/extend`, { extension_days: extensionDays });
  }

  getOverview(): Observable<LibraryOverview> {
    return this.http.get<LibraryOverview>(`${this.apiUrl}/overview`);
  }

  getActiveUsers(): Observable<ActiveUser[]> {
    return this.http.get<ActiveUser[]>(`${this.apiUrl}/users/active`);
  }

  getPopularBooks(): Observable<PopularBook[]> {
    return this.http.get<PopularBook[]>(`${this.apiUrl}/books/popular`);
  }

  getOverdueLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/overdue`);
  }
}