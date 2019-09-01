import { Component, OnInit, Inject } from '@angular/core';

import { DataService } from '../../services/data-service.service';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule, MatFormFieldModule, MatInputModule, MatRippleModule } from '@angular/material';
import { ProductAddComponent } from '../products/product-add/product-add.component';


@Component({
  selector: 'users-products',
  templateUrl: './usersproducts.component.html',
  styleUrls: ['./usersproducts.component.css']
})
export class UsersProductsComponent implements OnInit {

  constructor(private dataService: DataService, public dialog: MatDialog) { }

  ngOnInit() { }

  openAddProductDialog(): void {
    const dialogRef = this.dialog.open(ProductAddComponent, {
      width: '850px',
      height: '700px',
      disableClose: false,
      hasBackdrop: true,
      autoFocus: false,
      maxHeight: '90vh',
      maxWidth: '80vw',
      minWidth: '80vw',
    });
  }

}

