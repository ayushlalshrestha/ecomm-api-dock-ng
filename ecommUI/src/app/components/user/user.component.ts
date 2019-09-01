import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data-service.service';
import { User } from '../../models/user-profile.models';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public usersList;

  constructor(private dataService: DataService) {
    this.usersList = [];
  }

  ngOnInit() {
    this.dataService.getUsers().subscribe(
      users => {
        this.usersList = users;
      },
      err => {
        this.dataService.openSnackBar("Error retrieving users data", false);
        return null;
      }
    );;
  }

}
