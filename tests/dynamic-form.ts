import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  variationFields = [
    {
      name: 'Vaariation Title',
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
      name: 'imageLink',
      formControl: 'image',
      type: 'file'
    }
  ];

  public variationsForm: FormGroup;
  
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.variationsForm = this.fb.group({
      employees: this.fb.array([this.addEmployerDetails()])
    });
  }

  addEmployerDetails() {
    const employeeDetailsFormGroup = this.fb.group({});
    this.variationFields.forEach(field => {
      employeeDetailsFormGroup.addControl(field.formControl, this.fb.control([], Validators.required));
    });
    return employeeDetailsFormGroup;
  }

  addEmployerToFormArray() {
    this.employeeRows.push(this.addEmployerDetails());
    console.log(this.variationsForm.value);
  }

  get employeeRows() {
    return (<FormArray>this.variationsForm.get('employees'));
  }

}
