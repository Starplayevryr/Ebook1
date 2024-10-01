import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Renderer2, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Emitters } from '../../emitters/emitter';
import { isPlatformBrowser } from '@angular/common';

interface User {
  _id: string;
  name: string;
}

interface BlogPost {
  title: string;
  description: string;
  image: string;
  tags: string[];
  createdAt: string;
  user: User; // This is the user object with name and id
  username?: string; // Add this line to include username as an optional property
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  message: string = '';
  blogs: BlogPost[] = [];
  userNames: { [key: string]: string } = {}; // Store user names by user ID
  isLoggedIn: boolean = false;

  constructor(private http: HttpClient, private renderer: Renderer2, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.addClass(document.body, 'background-image');
    }

    const token = localStorage.getItem('authToken');

    this.http.get<{ name: string }>('http://localhost:5000/api/user', {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    }).subscribe(
      (res: { name: string }) => {
        this.message = `Hi ${res.name}`;
        this.isLoggedIn = true;
        Emitters.authEmitter.emit(true);

        this.fetchBlogs();
      },
      (err) => {
        console.error(err);
        this.message = 'You are not logged in';
        this.isLoggedIn = false;
        Emitters.authEmitter.emit(false);
      }
    );
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.removeClass(document.body, 'background-image');
    }
  }

  fetchBlogs(): void {
    this.http.get<BlogPost[]>('http://localhost:5000/api/blogs', { withCredentials: true })
      .subscribe(
        (blogs: BlogPost[]) => {
          this.blogs = blogs;
  
          // Assign the username from the user object to each blog post
          this.blogs.forEach(blog => {
            blog.username = blog.user.name; // Now this is valid
          });
        },
        (err) => {
          console.error('Error fetching blogs', err);
        }
      );
  }
  }
  
  
  
  
  // Fetch user details and return the username
  // Fetch user details based on user ID




  