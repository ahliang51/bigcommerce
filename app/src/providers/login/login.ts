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

  signUp(name, email, phoneNumber) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(vars.apiUrl + '/sign-up',
      {
        phoneNumber: phoneNumber,
        name: name,
        email: email
      }, { headers: headers })
      .map(res => res.json());
  }

  checkUserExist(email) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(vars.apiUrl + '/check-user-exist', { email: email }, { headers: headers })
      .map(res => res.json());
  }

  updateUserMobile(userId, phoneNumber) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(vars.apiUrl + '/update-user-mobile',
      {
        userId: userId,
        phoneNumber: phoneNumber
      }, { headers: headers })
      .map(res => res.json());
  }
}
