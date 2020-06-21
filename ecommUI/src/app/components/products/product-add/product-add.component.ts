
import { Component, OnInit, Inject} from '@angular/core';

import {  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

import { DataService } from '../../../services/data-service.service';

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
                    this.pushProductToForm(product);
                    if (product.variations){
                        this.pushVariationsToForm(product.variations);
                    }
                    this.productPK = this.data.productPK;
                    this.tags = product.tags || ['defaultWala'];
                },
                err => {
                    this.dataService.openSnackBar("Could not extract Product Details");
                    this.dialogRef.close();
                }

            )
        } else {
            this.editAction = false;
        }

    }
    pushProductToForm(product){
        this.productForm.setValue({
            title: product.title,
            description: product.description,
            tags: product.tags || ['']
        });
    }
    pushVariationsToForm(variations){
        var variationsToPush = [];
        variations.forEach(variation => {
            variationsToPush.push(
                this.addVariationToFormArray(variation)
            );
        });
        this.variationsForm = this.fb.group({
            variations: this.fb.array(variationsToPush)
        });
    }
    onSubmit() {
        var values = this.productForm.value;
        var productVariations = JSON.parse(JSON.stringify(this.variationsForm.value.variations));
        productVariations.forEach(variation => {
            var images = variation['variationimages'];
            delete variation['variationimages'];
            variation['variationimages'] = images.map(elem => { return { 'image': elem } });
        })
        var data = {
            'title': values.title,
            'description': values.description,
            'tags': values.tags,
            'publish': new Date().toISOString().slice(0, 10),
            'variations': productVariations
        }
        console.log(data);
        // return; 
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
            data['pk'] = this.productPK;
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
    addNewVariationToFormArray(){
        this.variationRows.push(this.addVariationDetails());
    }
    addVariationToFormArray(variation) {
        var variationGroup = this.addVariationDetails();
        variationGroup.addControl("pk", this.fb.control([]));
        var images = [];
        if (variation.variationimages && variation.variationimages.length > 0) {
            var allVariationImages = variation.variationimages;
            for (var i=0; i < allVariationImages.length; i++) {
                this.dataService.getImage(allVariationImages[i].image).subscribe(blobImage => {
                    // images.push(this.createImageFromBlob(blobImage)); // var file = new File([blobImage], "sample.jpg");
                    let reader = new FileReader();
                    reader.addEventListener("load", () => {
                        images.push(reader.result);
                    }, false);
                    reader.readAsDataURL(blobImage);
                });
            }
        }
        variationGroup.setValue({
            pk: variation.pk,
            title: variation.title,
            description: variation.description,
            price: variation.price,
            sale_price: variation.sale_price || variation.price,
            variationimages: images
        });
        console.log(variationGroup.value);
        return variationGroup;
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
        const files = event.target.files;
        var images = [];
        for (var i = 0; i < files.length ; i++) {
            var file = files[i];
            if (file.size / (1024 * 1024) > 3) {
                this.dataService.openSnackBar("Image "+ file.name + " larger than 3 MB");
                return;
            }
            var file_obj = new ImageUploadModel();
            file_obj.ImageType = file.type.split('/')[1];
            file_obj.Title = file.name;

            var reader: FileReader = new FileReader();
            // reader.onloadend = (e) => { ... };
            reader.addEventListener("load", () => {
                file_obj.Base64String = reader.result.toString();
                images.push(JSON.stringify(file_obj));
            }, false);
            reader.readAsDataURL(file);
        }
        this.variationRows.value[index].variationimages = images;
    }
    createImageFromBlob(image: Blob) {
        let reader = new FileReader();
        reader.addEventListener("load", () => {
            return reader.result;
        }, false);

        if (image) {
            reader.onload = function(){
                return reader.result;
            }
            reader.readAsDataURL(image);
        }
    }
    addTags(selectedTags: any[]) {
        this.productForm.patchValue({ tags: selectedTags });
    }

}

