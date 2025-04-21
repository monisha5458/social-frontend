import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api/users'; // Adjust URL to your backend API

  constructor(private http: HttpClient) {}

  // Get user profile
  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get auth headers with the token
  private getAuthHeaders(): HttpHeaders {
    const user = JSON.parse(localStorage.getItem('user')!);
    const token = user?.token;
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}
