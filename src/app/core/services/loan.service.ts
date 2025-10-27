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
}