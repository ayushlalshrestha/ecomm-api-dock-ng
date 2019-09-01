// import 'materialize-css';
import { MaterializeModule } from 'angular2-materialize';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
  MatButtonModule, MatFormFieldModule, MatInputModule, MatRippleModule,
  MatCardModule, MatProgressSpinnerModule, MatMenuModule, MatIconModule,
  MatTableModule, MatCheckboxModule, MatToolbarModule, MatSnackBarModule,
  MatSelectModule, MatSortModule, MatPaginatorModule, MatCheckbox,
  MatChipsModule, MatAutocompleteModule
} from '@angular/material';

import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { DataService } from './services/data-service.service';
import { MyHttpInterceptor } from './services/auth.interceptor';

import { ProductsComponent } from './components/products/products.component';

import { ProductsListComponent } from './components/products/products-list/products-list.component';
import { ProductDetailComponent } from './components/products/product-detail/product-detail.component';
import { ProductAddComponent } from './components/products/product-add/product-add.component';


import { UserComponent } from './components/user/user.component';
import { UsersProductsComponent } from './components/usersproducts/usersproducts.component';
import { UsersProductsListComponent } from './components/usersproducts/users-products-list/users-products-list.component'
import { UsersSessionComponent } from './components/usersession/usersession.component';

import { ShortMessageComponent } from './shared/snackbar/snackbar.component';
import { TagChipsComponent } from './shared/tagchips/tagchips.component';

const appRoutes: Routes = [
  { path: '', component: ProductsComponent },
  { path: 'users', component: UserComponent },
  { path: 'session', component: UsersSessionComponent },
  { path: 'usersProducts', component: UsersProductsComponent }
];

@NgModule({
  declarations: [
    AppComponent, ProductsComponent, UsersProductsComponent,
    ProductAddComponent, ProductDetailComponent,
    ProductsListComponent, UsersProductsListComponent,
    UsersSessionComponent, UserComponent,
    ShortMessageComponent,
    TagChipsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),

    MaterializeModule,
    MatDialogModule,
    MatRippleModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatChipsModule,
    MatAutocompleteModule

  ],
  providers: [
    DataService,
    { provide: HTTP_INTERCEPTORS, useClass: MyHttpInterceptor, multi: true },
    // { provide: MatDialogRef, useValue: {} },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ProductDetailComponent, ProductAddComponent, ShortMessageComponent
  ]
})
export class AppModule { }




