import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'http://localhost:5000/api/blogs'; // Your API URL

  constructor(private http: HttpClient) {}

  // Method to create a blog post
  createBlog(formData: FormData): Observable<any> {
    const token = localStorage.getItem('authToken'); // Get the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    console.log('Creating blog post...'); // Log the initiation of the POST request

    return this.http.post(this.apiUrl, formData, { headers }); // Send POST request
  }
}
