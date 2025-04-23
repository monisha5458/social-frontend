import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

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

  // This is the method you're missing
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }

   // New: search users by username
   searchUsers(q: string): Observable<{ _id: string; username: string }[]> {
    return this.http
      .get<{ _id: string; username: string }[]>(`${this.apiUrl}/search?q=${encodeURIComponent(q)}`, {
        headers: this.getAuthHeaders()
      })
      .pipe(catchError(this.handleError));
  }
  followUser(userId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/follow/${userId}`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }
  unfollowUser(userId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/unfollow/${userId}`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }
}
