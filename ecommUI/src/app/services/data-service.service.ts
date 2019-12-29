
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
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.baseURL + '/products/create/', data, {
      withCredentials: true,
      headers: headers
    });

    // const newProduct = new FormData();
    // newProduct.append('title', data.title);
    // newProduct.append('description', data.content);
    // newProduct.append('tags', data.tags);

    // if (data.image && data.image.name) {
    //   newProduct.append('image', data.image, data.image.name);
    // }

    // return this.http.post(this.baseURL + '/products/create/', newProduct, {
    //   withCredentials: true
    // });
  }
  editProduct(data: any = null, extract = true) {
    const productID = data.productPK;

    if (extract) {
      return this.http.get<Product>(this.baseURL + '/products/' + productID + '/update/', {
        withCredentials: true
      });
    } else {
      const editedProduct = new FormData();
      editedProduct.append('title', data.title);
      editedProduct.append('description', data.content);
      editedProduct.append('tags', data.tags);
      // if (data.image && data.image.name) {
      //   editedProduct.append('image', data.image, data.image.name);
      // }

      return this.http.put<Product>(this.baseURL + '/products/' + productID + '/update/', editedProduct, {
        withCredentials: true
      });
    }
  }
  getUsers() {
    return this.http.get<User[]>(this.baseURL + '/users/profiles/', { withCredentials: true });
  }
  login(data) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
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


