import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  private baseUrl = 'http://localhost:5000/api/friend-requests';
  private userBaseUrl = 'http://localhost:5000/api/users';
  requests: any[] = [];
  sentRequests: any[] = [];
  allUsers: any[] = [];
  loadingUsers: boolean = true;
  loadingRequests: boolean = true;
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getRequests();
    this.getSentRequests();
    this.getAllUsers();
  }

  // Helper method to get the token from local storage
  private getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  // Create HTTP headers with the token
  private createHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  sendRequest(receiverId: string): void {
    const headers = this.createHeaders();
    this.http.post(`${this.baseUrl}/send-request`, { receiverId }, { headers })
      .subscribe({
        next: response => {
          console.log(response);
          this.getSentRequests();
        },
        error: error => {
          console.error('Error sending friend request:', error);
          this.errorMessage = error.error?.message || 'An error occurred';
        }
      });
  }

  acceptRequest(requestId: string): void {
    const headers = this.createHeaders();
    this.http.post(`${this.baseUrl}/accept-request/${requestId}`, {}, { headers })
      .subscribe({
        next: response => {
          console.log(response);
          this.getRequests();
        },
        error: error => {
          console.error('Error accepting friend request:', error);
          this.errorMessage = error.error?.message || 'An error occurred';
        }
      });
  }

  rejectRequest(requestId: string): void {
    const headers = this.createHeaders();
    this.http.post(`${this.baseUrl}/reject-request/${requestId}`, {}, { headers })
      .subscribe({
        next: response => {
          console.log(response);
          this.getRequests();
        },
        error: error => {
          console.error('Error rejecting friend request:', error);
          this.errorMessage = error.error?.message || 'An error occurred';
        }
      });
  }

  getRequests(): void {
    const headers = this.createHeaders();
    this.http.get<any[]>(`${this.baseUrl}/requests`, { headers })
      .subscribe({
        next: requests => {
          this.requests = requests;
          this.loadingRequests = false;
        },
        error: error => {
          console.error('Error fetching received requests:', error);
          this.errorMessage = error.error?.message || 'An error occurred';
          this.loadingRequests = false;
        }
      });
  }

  getSentRequests(): void {
    const headers = this.createHeaders();
    this.http.get<any[]>(`${this.baseUrl}/sent-requests`, { headers })
      .subscribe({
        next: sentRequests => {
          this.sentRequests = sentRequests;
          this.loadingRequests = false;
        },
        error: error => {
          console.error('Error fetching sent requests:', error);
          this.errorMessage = error.error?.message || 'An error occurred';
          this.loadingRequests = false;
        }
      });
  }

  getAllUsers(): void {
    const headers = this.createHeaders();
    this.http.get<any[]>(this.userBaseUrl, { headers })
      .subscribe({
        next: users => {
          this.allUsers = users;
          this.loadingUsers = false;
        },
        error: error => {
          console.error('Error fetching users:', error);
          this.errorMessage = error.error?.message || 'An error occurred';
          this.loadingUsers = false;
        }
      });
  }

  cancelRequest(requestId: string): void {
    const headers = this.createHeaders();
    this.http.delete(`${this.baseUrl}/cancel-request/${requestId}`, { headers })
      .subscribe({
        next: response => {
          console.log(response);
          this.getSentRequests();
        },
        error: error => {
          console.error('Error canceling friend request:', error);
          this.errorMessage = error.error?.message || 'An error occurred';
        }
      });
  }
}
