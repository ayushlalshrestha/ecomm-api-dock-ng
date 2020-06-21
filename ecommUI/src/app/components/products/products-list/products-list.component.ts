
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { DataService } from '../../../services/data-service.service';
import { Product, Variation } from '../../../models/product.models';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductListData, getProductsData } from '../../../models/products.interfaces';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})

export class ProductsListComponent implements OnInit {

  public productsDataList: ProductListData[];

  columnNames = [
    { id: "title", value: "title" },
    { id: "description", value: "description" },
    { id: "sold_by", value: "sold_by" },
    { id: "price", value: "price" }
  ];

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<ProductListData>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dataService: DataService, public dialog: MatDialog) { }

  ngOnInit() {
    this.productsDataList = [];
    this.displayedColumns = this.columnNames.map(x => x.id);
    this.displayedColumns.push('actions');
    this.refreshProducts();
  }

  refreshProducts() {
    this.dataService.getProducts().subscribe(
      products => {
        var products = products['results'];
        this.productsDataList = getProductsData(products);
        this.dataSource = new MatTableDataSource(this.productsDataList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => {
        this.dataService.openSnackBar("Error retrieving data", false);
      }
    )
  }

  openProductDetailDialog(productPK: String): void {
    const dialogRef = this.dialog.open(ProductDetailComponent, {
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}