import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api'; // Adjust this to your API URL

  constructor(private http: HttpClient) {}

  // Login method
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          // Assuming the response contains a token
          localStorage.setItem('authToken', response.token);
        })
      );
  }

  // Logout method
  logout(): void {
    localStorage.removeItem('authToken');
  }

  // Method to update user settings
  


  // Method to check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }
}
