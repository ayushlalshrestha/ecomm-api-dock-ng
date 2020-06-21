
import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../../../services/data-service.service';

import M from 'materialize-css';
import { getProductData, ProductListData } from '../../../models/products.interfaces';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
    options = { fullWidth: false };
    items = ["https://picsum.photos/200/300?image=0", "https://picsum.photos/200/300?image=1", 
            "https://picsum.photos/200/300?image=2", "https://picsum.photos/200/300?image=3",
            "https://picsum.photos/200/300?image=4"];
    hrefs = ['one', 'two', 'three', 'four', 'five'];

    product: ProductListData;
    isLoaded: boolean = false;
    images: any[] = [];
    
    constructor(private dataService: DataService,
        public dialogRef: MatDialogRef<ProductDetailComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        // this.product = null;
    }
    ngOnInit() {
        this.dataService.getProductDetails(this.data.productPK).subscribe(
            product => {
                // this.dataService.productSelected.emit(product);
                this.product = getProductData(product);
                product.variations.forEach(variation => {
                    variation.variationimages.forEach(image => {
                        this.images.push(image.image);
                    });
                });
                this.isLoaded = true;
            },
            err => {
                this.dataService.openSnackBar("Error retrieving data", false);
                this.dialogRef.close();
            }
        );
    }
    ngAfterViewInit() {
        // no errors
        setTimeout(() => {
            let elems = document.querySelectorAll('.carousel');
            let instances = M.Carousel.init(elems, this.options);
         }, 4000);
    }
}