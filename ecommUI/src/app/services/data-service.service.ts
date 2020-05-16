
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ShortMessageComponent } from '../shared/snackbar/snackbar.component'
import { MatSnackBar } from '@angular/material';


import { Product } from '../models/product.models';
import { User } from '../models/user-profile.models';
import { Observable } from 'rxjs';
import { ResponseContentType, RequestOptions } from '@angular/http';
import { ProductListData, getProductData } from '../models/products.interfaces';

@Injectable()
export class DataService {
  productSelected = new EventEmitter<Product>();
  baseURL = 'http://localhost:5050';
// baseURL = '.';

  constructor(public http: HttpClient, private _snackBar: MatSnackBar) {
  }

  getProducts(pageNumber: Number = 1) {
    return this.http.get<any>(
      this.baseURL + '/products/list/?page=' + pageNumber)
  }
  getProductDetails(pk: any = 1) {
    return this.http.get<Product>(this.baseURL + '/products/' + pk + '/')
  }
  getUsersProducts(pageNumber: Number = 1) {
    return this.http.get<any>(this.baseURL + '/products/list/?session_users=' + true);

  }
  newProduct(data) {
    var headers = new HttpHeaders().append('Content-Type', 'application/json'); // multipart/form-data 'application/x-www-form-urlencoded'
    return this.http.post(this.baseURL + '/products/create/', data, {
      withCredentials: true,
      headers: headers
    });
  }
  editProduct(data: any = null, extract = true) {
    const productID = data.productPK;

    if (extract) {
        return this.http.get<Product>(this.baseURL + '/products/' + productID + '/update/', {
            withCredentials: true
        });
    } else {
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json'); // application/x-www-form-urlencoded
        return this.http.put<Product>(this.baseURL + '/products/' + productID + '/update/', data, {
            withCredentials: true,
            headers: headers
        });
    }
  }
  getUsers() {
    return this.http.get<User[]>(this.baseURL + '/users/profiles/', { withCredentials: true });
  }
  login(formData) {
    return this.http.post(this.baseURL + '/users/api-token-login/', formData);
  }
  getSessionDetails() {
    return this.http.get<any>(this.baseURL + '/users/sessionDetails/', { withCredentials: true });
  }
  openSnackBar(message, success = true) {
    var data = {
      message: message,
      success: success
    };

    this._snackBar.openFromComponent(ShortMessageComponent, {
      duration: 3000,
      data: data
    });
  }
  getImage(imageUrl: string) {
    return this.http.get(imageUrl, { responseType: 'blob' });
  }

}


