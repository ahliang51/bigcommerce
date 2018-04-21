import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import * as vars from '../../global-variable';

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginProvider {

  constructor(public http: Http) {
    console.log('Hello LoginProvider Provider');
  }

  signUp(name, email, phoneNumber, facebookId) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(vars.apiUrl + '/auth/sign-up',
      {
        phoneNumber: phoneNumber,
        name: name,
        email: email,
        facebookId: facebookId
      }, { headers: headers })
      .map(res => res.json());
  }

  checkUserExist(email, phoneNumber, facebookId) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(vars.apiUrl + '/auth/check-user-exist', {
      email: email,
      phoneNumber: phoneNumber,
      facebookId: facebookId
    }, { headers: headers })
      .map(res => res.json());
  }

  updateUserMobile(userId, phoneNumber) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(vars.apiUrl + '/auth/update-user-mobile',
      {
        userId: userId,
        phoneNumber: phoneNumber
      }, { headers: headers })
      .map(res => res.json());
  }
}
