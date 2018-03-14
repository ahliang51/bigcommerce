import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import * as vars from '../../global-variable';

/*
  Generated class for the ProfileProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProfileProvider {

  constructor(public http: Http) {
    console.log('Hello ProfileProvider Provider');
  }

  retrieveProfile(token) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(vars.apiUrl + '/retrieve-user-info', { jwt: token }, { headers: headers })
      .map(res => res.json());
  }
}
