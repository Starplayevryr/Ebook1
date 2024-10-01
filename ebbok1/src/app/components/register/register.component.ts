import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] // Corrected 'styleUrl' to 'styleUrls'
})
export class RegisterComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: "",
      email: "",
      password: "",
      age: "",
      gender: ""
    });
  }

  ValidateEmail = (email: any): boolean => {
    // Regular expression for validating an email
    const validRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Test the email against the regex and return the result
    return validRegex.test(email);
  };

  submit(): void {
    let user = this.form.getRawValue();
    console.log(user);

    if (user.name == "" || user.email == "" || user.password == "" || user.age == "" || user.gender == "") {
      Swal.fire("Error", "Please enter all fields", "error");
    } else if (!this.ValidateEmail(user.email)) {
      Swal.fire("Error", "Please enter a valid email", "error");
    } else {
      this.http.post("http://localhost:5000/api/register", user, {
        withCredentials: true
      })
      .subscribe(() => {
        // On successful registration, redirect to the login page
        Swal.fire("Success", "Registration successful! Please log in.", "success")
          .then(() => {
            this.router.navigate(['/login']); // Navigate to the login page
          });
      }, (err) => {
        Swal.fire("Error", err.error.message, "error");
      });
    }
  }
}
