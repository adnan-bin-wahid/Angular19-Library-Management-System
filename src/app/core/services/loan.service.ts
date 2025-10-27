import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoanRequest {
  user_id: string;
  book_id: string;
  due_date: string;
}

export interface Loan {
  id: string;
  user_id: string;
  book_id: string;
  issue_date: string;
  due_date: string;
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
}