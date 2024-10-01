import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  isLoading = false; // Loading state for the button

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], // Added Validators
      password: ['', [Validators.required]]
    });
  }

  submit(): void {
    const user = this.form.getRawValue();

    // Validate fields
    if (this.form.invalid) {
      Swal.fire("Error", "Please fill all fields correctly.", "error");
      return;
    }

    this.isLoading = true; // Set loading state

    // Perform login
    this.http.post("http://localhost:5000/api/login", user, {
      withCredentials: true
    })
    .subscribe((response: any) => {
      localStorage.setItem('authToken', response.token); // Store token securely
      Swal.fire("Success", "Logged in successfully!", "success")
          .then(() => {
              this.router.navigate(['/']); // Redirect to home or dashboard
          });
    }, (err) => {
      Swal.fire("Error", err.error.message || "Login failed", "error"); // Handle API errors
    })
    .add(() => {
      this.isLoading = false; // Reset loading state after request completes
    });
  }
}
