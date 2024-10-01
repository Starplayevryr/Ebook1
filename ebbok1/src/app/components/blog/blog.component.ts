import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  blogs: any[] = []; // Array to hold blog posts
  message: string = 'Here are the latest blog posts!'; // Message to display
  isLoggedIn: boolean = false; // Update based on your authentication logic

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    this.fetchAllBlogs();
  }

  checkLoginStatus() {
    // Logic to check if the user is logged in
    this.isLoggedIn = true; // Update based on your authentication logic
  }

  fetchAllBlogs() {
    this.http.get<any[]>('http://localhost:5000/api/blogs') // Adjust the URL according to your API
      .subscribe(
        (data) => {
          this.blogs = data; // Assign fetched data to blogs
        },
        (error) => {
          console.error('Error fetching blogs', error);
        }
      );
  }
}
