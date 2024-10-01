import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Emitters } from '../../emitters/emitter';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-navigate',
  templateUrl: './navigate.component.html',
  styleUrls: ['./navigate.component.css']
})
export class  NavigateComponent implements OnInit {
  authenticated = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('http://localhost:5000/api/user', { withCredentials: true })
      .subscribe(
        (res: any) => {
          this.authenticated = true;
          Emitters.authEmitter.emit(true);
        },
        (err) => {
          console.error(err);
          this.authenticated = false;
          Emitters.authEmitter.emit(false);
        }
      );
  }

  logout() {
    this.http.post('http://localhost:5000/api/logout', {}, { withCredentials: true })
      .subscribe(() => {
        this.authenticated = false;
        Emitters.authEmitter.emit(false);
      });
  }
}