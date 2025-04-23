import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface Post {
  _id: string;
  content: string;
  mediaUrl?: string;
  author: {
    _id: string;
    username: string;
  };
  likes: string[];
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:5000/api/posts'; // Base API URL

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const user = JSON.parse(localStorage.getItem('user')!);
    const token = user?.token;

    if (!token) {
      throw throwError(() => new Error('User not authenticated'));
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Get posts from users the current user is following
  getFollowingFeed(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/feed`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // Create a new post
  createPost(content: string, media: File | null): Observable<Post> {
    const formData = new FormData();
    formData.append('content', content);
    if (media) {
      formData.append('media', media);
    }

    return this.http.post<Post>(`${this.apiUrl}/create`, formData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // ✅ FIXED: Correct delete URL
  deletePost(postId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${postId}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }


  // Get general feed
  getFeed(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // ❌ FIXED: Removed duplicate `/api/posts`
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // Generic error handler
  private handleError(error: any) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code: ${error.status}, message: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

 likePost(postId: string): Observable<any> {
  return this.http.put(`${this.apiUrl}/like/${postId}`, {}, {
    headers: this.getAuthHeaders()
  }).pipe(catchError(this.handleError));
 
}

  
  unlikePost(postId: string) {
    return this.http.put(`${this.apiUrl}/unlike/${postId}`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }
}
