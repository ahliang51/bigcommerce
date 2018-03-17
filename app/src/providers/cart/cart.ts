import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import * as vars from '../../global-variable';

/*
  Generated class for the CartProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CartProvider {

  constructor(public http: Http) {
    console.log('Hello CartProvider Provider');
  }

  createCart(token, cart) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(vars.apiUrl + '/cart/create-cart', {
      token: token,
      cart: cart
    }, { headers: headers })
      .map(res => res.json());
  }

  updateCart(cartId, itemId, productId, quantity) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(vars.apiUrl + '/cart/update-cart', {
      cartId: cartId,
      itemId: itemId,
      productId: productId,
      quantity: quantity
    }, { headers: headers })
      .map(res => res.json());
  }

  retrieveCart(cartId) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(vars.apiUrl + '/cart/retrieve-cart', {
      cartId: cartId,
    }, { headers: headers })
      .map(res => res.json());
  }

  addToCart(cartId, item) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(vars.apiUrl + '/cart/add-item', {
      cartId: cartId,
      item: item
    }, { headers: headers })
      .map(res => res.json());
  }

  removeItem(cartId, itemId) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(vars.apiUrl + '/cart/remove-item', {
      cartId: cartId,
      itemId: itemId
    }, { headers: headers })
      .map(res => res.json());
  }
}
