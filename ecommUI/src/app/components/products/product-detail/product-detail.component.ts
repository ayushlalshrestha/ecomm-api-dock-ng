
import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../../../services/data-service.service';

import {Product, Variation, VariationImage} from '../../../models/product.models';
import {User} from '../../../models/user-profile.models';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product;

  constructor(private dataService: DataService,
    public dialogRef: MatDialogRef<ProductDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.product = null;
     }

  ngOnInit() {
    alert(this.data.productPK);
    this.dataService.getProductDetails(this.data.productPK).subscribe(
      product => {
        this.dataService.productSelected.emit(product);
        this.product = product;
      },
      err => {
        this.dataService.openSnackBar("Error retrieving data", false);
        return null;
      }
    );
  }

}