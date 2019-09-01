
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { DataSource } from '@angular/cdk/table';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { DataService } from '../../../services/data-service.service';
import { ProductListData, getProductData } from '../../../models/products.interfaces';
import { ProductDetailComponent } from '../../products/product-detail/product-detail.component';
import { ProductAddComponent } from '../../products/product-add/product-add.component';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'users-products-list',
  templateUrl: './users-products-list.component.html',
  styleUrls: ['./users-products-list.component.css']
})
export class UsersProductsListComponent implements OnInit {
  public usersProductsDataList: ProductListData[];

  columnNames = [
    { id: "title", value: "title" },
    { id: "description", value: "description" },
    { id: "sold_by", value: "sold_by" },
    { id: "price", value: "price" }
  ];

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dataService: DataService, public dialog: MatDialog) { }

  ngOnInit() {
    this.usersProductsDataList = [];
    this.displayedColumns = this.columnNames.map(x => x.id);
    this.displayedColumns.push('actions');
    this.refreshUsersProducts();
  }

  refreshUsersProducts() {
    // var usersProductsDataList = new Array<ProductListData>();
    this.dataService.getUsersProducts().subscribe(
      products => {
        var products = products['results'];
        this.usersProductsDataList = getProductData(products);
        this.dataSource = new MatTableDataSource(this.usersProductsDataList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => {
        this.dataService.openSnackBar("Error retrieving data", false);
      }
    );

  }

  openProductDetailDialog(productPK: String): void {
    const productDetailDialogRef = this.dialog.open(ProductDetailComponent, {
      width: '800px',
      height: '700px',
      disableClose: false,
      hasBackdrop: true,
      data: { productPK: productPK },
      autoFocus: false,
      maxHeight: '90vh',
      maxWidth: '80vw',
      minWidth: '80vw',
    });
  }

  openProductEditDialog(productPK: String): void {
    const productEditDialogRef = this.dialog.open(ProductAddComponent, {
      width: '800px',
      height: '700px',
      disableClose: false,
      hasBackdrop: true,
      data: {
        productPK: productPK,
        edit: true
      },
      autoFocus: false,
      maxHeight: '90vh',
      maxWidth: '80vw',
      minWidth: '80vw',
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}