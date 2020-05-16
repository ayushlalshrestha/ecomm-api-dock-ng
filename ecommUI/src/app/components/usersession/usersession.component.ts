import { Component, OnInit, Inject, EventEmitter, ViewChild } from '@angular/core';
import { DataService } from '../../services/data-service.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-usersession',
  templateUrl: './usersession.component.html',
  styleUrls: ['./usersession.component.css']
})
export class UsersSessionComponent implements OnInit {
  loggedInUser: any;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.updateSessionDetails();
  }

  onLogin(f: NgForm) {
    const formData = new FormData();
    formData.append('username', f.value.username);
    formData.append('password', f.value.password);
    this.dataService.login(formData).subscribe(
      res => {
        if (res['success'] === true) {
          localStorage.setItem('jwt_token', res['token']);
          this.updateSessionDetails();
          this.dataService.openSnackBar("Logged in as " + f.value.username);
        } else if (res['error']) {
          this.dataService.openSnackBar("Login failed", false);
        }
      },
      err => {
        this.dataService.openSnackBar("error logging in", false);
      }
    );
  }
  onLogout() {
    localStorage.removeItem("jwt_token");
    this.updateSessionDetails();
    this.dataService.openSnackBar("Logged out!!");
  }
  updateSessionDetails() {
    if (localStorage.getItem('jwt_token')) {
      this.dataService.getSessionDetails().subscribe(
        res => {
          this.loggedInUser = res;
        },
        err => {
          this.dataService.openSnackBar("Error retrieving session details", false);
        }
      );
    } else {
      this.loggedInUser = null;
    }

  }
}