import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule, MatFormFieldModule, MatInputModule, MatRippleModule } from '@angular/material';

import { DataService } from '../../services/data-service.service';

import { Product } from '../../models/product.models';
import { ProductAddComponent } from './product-add/product-add.component';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  
  constructor(private dataService: DataService, public dialog: MatDialog) { }

  ngOnInit() {
    this.dataService.productSelected.subscribe(
      (product: Product) => {
        console.log(product);
      }
    );
  }

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

