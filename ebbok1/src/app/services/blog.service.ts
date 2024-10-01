import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'http://localhost:5000/api/blogs'; // Your API URL

  constructor(private http: HttpClient) {}

  // Method to create a blog post
  createBlog(formData: FormData): Observable<any> {
    const token = localStorage.getItem('authToken'); // Get the token
    console.log('Token being sent from service:', token); // Log the token

    // Check if token exists
    if (!token) {
      console.error('No auth token found!');
      return throwError('No auth token found'); // Handle absence of token
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Set authorization header
    });

    return this.http.post(this.apiUrl, formData, { headers }).pipe(
      catchError(err => {
        console.error('Error creating blog:', err); // Log error details
        return throwError(err); // Propagate error to the caller
      })
    ); // Send POST request with error handling
  }
}
