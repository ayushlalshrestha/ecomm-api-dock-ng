import { Component, OnInit, Inject } from '@angular/core';

import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';

import { DataService } from '../../../services/data-service.service';
import { TagChipsComponent } from '../../../shared/tagchips/tagchips.component';
import { Product } from '../../../models/product.models';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent implements OnInit {
  editAction: boolean;
  productPK: any;

  // selectedImage: File;
  productForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    tags: new FormControl('')
  });
  tags: string[] = [];

  constructor(private dataService: DataService,
    public dialogRef: MatDialogRef<ProductAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    
    // Differentiates new product creation or old product edit action
    this.editAction = false;
    this.productPK = null;
  }

  ngOnInit() {
    if (this.data && this.data.edit == true && this.data.productPK) {
      this.editAction = true;
      this.dataService.editProduct(this.data, true).subscribe(
        product => {
          this.productForm.setValue({
            title: product.title,
            description: product.description,
            tags: product.tags || ['']
          });
          this.productPK = this.data.productPK;
          this.tags = product.tags || ['defaultWala'];
        }
      )
    } else {
      this.editAction = false;
    }

  }

  onSubmit() {
    var values = this.productForm.value;
    const data = {
      title: values.title,
      content: values.content,
      tags: values.tags.join(",")
    };
    if (!this.editAction) {
      this.dataService.newProduct(data).subscribe(
        res => {
          this.dataService.openSnackBar("Successfully posted");
        },
        err => {
          this.dataService.openSnackBar("Post failed");
        }
      );
    } else {
      data['productPK'] = this.productPK;
      this.dataService.editProduct(data, false).subscribe(
        res => {
          this.dataService.openSnackBar("Successfully edited");
          this.dialogRef.close();
        },
        err => {
          this.dataService.openSnackBar("Edit failed");
        }
      );
    }
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
  onImageChanged(event) {
    const file = event.target.files[0];
    if (file.size/(1024*1024) > 3){
      this.dataService.openSnackBar("Image larger than 3 MB");
      return ;
    }
    // this.selectedImage = file;
  }
  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      let imageToShow = reader.result; // here is the result you got from reader
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }
  addTags(selectedTags: any[]){
    this.productForm.patchValue({tags: selectedTags});
  }

}

