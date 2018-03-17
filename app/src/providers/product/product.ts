import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import * as vars from '../../global-variable';
/*
  Generated class for the ProductProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProductProvider {

  constructor(public http: Http) {
    console.log('Hello ProductProvider Provider');
  }

  retrieveCategories() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(vars.apiUrl + '/product/categories', { headers: headers })
      .map(res => res.json());
  }

  retrieveProductCategories(categoryId) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(vars.apiUrl + '/product/product-categories', { categoryId: categoryId }, { headers: headers })
      .map(res => res.json());
  }

  retrieveProductDetails(productId) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(vars.apiUrl + '/product/product-detail', { productId: productId }, { headers: headers })
      .map(res => res.json());
  }
}
