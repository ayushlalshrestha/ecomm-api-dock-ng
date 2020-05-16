
import { Component, OnInit, Inject, Input, SimpleChanges, OnChanges } from '@angular/core';

import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

import { DataService } from '../../../services/data-service.service';
import { TagChipsComponent } from '../../../shared/tagchips/tagchips.component';
import { Product } from '../../../models/product.models';

export class ImageUploadModel {
    Title: string;
    Description: string;
    ImageType: string;
    Base64String: string;
}
@Component({
    selector: 'app-product-add',
    templateUrl: './product-add.component.html',
    styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent implements OnInit {
    variationFields = [
        {
            name: 'Variation Title',
            formControl: 'title',
            type: 'text'
        },
        {
            name: 'Description',
            formControl: 'description',
            type: 'text'
        },
        {
            name: 'Price',
            formControl: 'price',
            type: 'number'
        },
        {
            name: 'Sale Price',
            formControl: 'sale_price',
            type: 'number'
        },
        {
            name: 'Variations Images',
            formControl: 'variationimages',
            type: 'file'
        }
    ];
    variationsForm: FormGroup;
    editAction: boolean;
    productPK: any;

    productForm = new FormGroup({
        title: new FormControl(''),
        description: new FormControl(''),
        tags: new FormControl('')
    });
    tags: string[] = [];

    constructor(private dataService: DataService,
        public dialogRef: MatDialogRef<ProductAddComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {

        this.editAction = false;
        this.productPK = null;
    }

    ngOnInit() {
        this.variationsForm = this.fb.group({
            variations: this.fb.array([this.addVariationDetails()])
        });

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
        var productVariation = this.variationsForm.value.variations;
        productVariation.forEach(variation => {
            var images = variation['variationimages'];
            delete variation['variationimages'];
            variation['variationimages'] = images.map(elem => { return { 'image': elem } });
        })
        var data = {
            'title': values.title,
            'description': values.description,
            'tags': values.tags,
            'publish': new Date().toISOString().slice(0, 10),
            'variations': productVariation
        }
        console.log(data);
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
                    this.dialogRef.close();
                    this.dataService.openSnackBar("Successfully edited");
                },
                err => {
                    this.dataService.openSnackBar("Edit failed");
                }
            );
        }
    }
    addVariationDetails() {
        const variationDetailsFormGroup = this.fb.group({});
        this.variationFields.forEach(field => {
            variationDetailsFormGroup.addControl(field.formControl, this.fb.control([], Validators.required));
        });
        return variationDetailsFormGroup;
    }
    addVariationToFormArray() {
        this.variationRows.push(this.addVariationDetails());
    }
    removeVariation(event, index) {
        if (this.variationRows.value.length == 1) {
            return
        }
        this.variationRows.removeAt(index);
    }
    get variationRows() {
        return (<FormArray>this.variationsForm.get('variations'));
    }
    onCloseClick(): void {
        this.dialogRef.close();
    }
    onImageChanged(event, index) {
        // files.forEach(file => {
        //   if (file.size / (1024 * 1024) > 3) {
        //     this.dataService.openSnackBar("Image "+ file.name + " larger than 3 MB");
        //     return;
        //   }
        // });
        const file = event.target.files[0];
        var file_obj = new ImageUploadModel();
        file_obj.ImageType = file.type.split('/')[1];
        file_obj.Title = file.name;

        const myReader: FileReader = new FileReader();
        myReader.onloadend = (e) => {
            file_obj.Base64String = myReader.result.toString();
            this.variationRows.value[index].variationimages = [JSON.stringify(file_obj),];
        };
        myReader.readAsDataURL(file);
    }
    createImageFromBlob(image: Blob) {
        let reader = new FileReader();
        reader.addEventListener("load", () => {
            let imageToShow = reader.result;
        }, false);

        if (image) {
            reader.readAsDataURL(image);
        }
    }
    addTags(selectedTags: any[]) {
        this.productForm.patchValue({ tags: selectedTags });
    }

}

