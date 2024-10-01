import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BlogService } from '../../services/blog.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blog-create',
  templateUrl: './blog-create.component.html',
  styleUrls: ['./blog-create.component.css']
})
export class BlogCreateComponent implements OnInit {
  title: string = '';
  description: string = '';
  tagInput: string = '';
  tags: string[] = [];
  image: File | null = null;
  userId: string | null = null;

  constructor(private blogService: BlogService, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // Check if running in the browser before accessing localStorage
    if (isPlatformBrowser(this.platformId)) {
      this.userId = localStorage.getItem('userId');
    }
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.image = fileInput.files[0];
    }
  }

  addTag(): void {
    const trimmedTag = this.tagInput.trim();
    if (trimmedTag && !this.tags.includes(trimmedTag)) {
      this.tags.push(trimmedTag);
      this.tagInput = '';
    }
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
  }

  createBlog(): void {
    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('description', this.description);
    if (this.image) {
      formData.append('image', this.image);
    }
    formData.append('tags', JSON.stringify(this.tags));
    if (this.userId) {
      formData.append('user', this.userId);
    }

    // Use the blog service to create the blog
    this.blogService.createBlog(formData).subscribe(
      response => {
        console.log('Blog created successfully:', response); // Log success message
        Swal.fire('Success', 'Blog created successfully!', 'success').then(() => {
          this.resetForm(); // Reset form after successful submission
        });
      },
      error => {
        console.error('Error creating blog:', error); // Log error message
        Swal.fire('Error', 'There was an issue creating the blog: ' + (error.error?.message || 'Unknown error'), 'error');
      }
    );
  }

  // Helper method to reset the form fields
  private resetForm(): void {
    this.title = '';
    this.description = '';
    this.image = null;
    this.tags = [];
    this.tagInput = ''; // Clear the tag input field
  }
}
