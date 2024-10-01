import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(0)]],
      gender: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  submit(): void {
    const user = this.form.getRawValue();

    if (!user.name || !user.email || !user.age || !user.gender || !user.password) {
      Swal.fire("Error", "Please enter all fields", "error");
      return;
    }

    this.http.put("http://localhost:5000/api/update-settings", user, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Include your token here if needed
      },
      withCredentials: true
    })
    .subscribe((response: any) => {
      Swal.fire("Success", "Settings updated successfully!", "success")
          .then(() => {
              this.router.navigate(['/']); // Redirect to home or dashboard
          });
    }, (err) => {
      Swal.fire("Error", err.error.message || "Update failed", "error"); // Handle API errors
    });
}
}
