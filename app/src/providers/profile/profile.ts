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
    let headers = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
      'Content-Type': 'application/json; charset=UTF-8',
      'Accept': 'application/json'
    });
    // let headers = new Headers();
    // headers.append('Access-Control-Allow-Origin', '*'),
    //   headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT'),
    //   headers.append('Content-Type', 'application/json');
    return this.http.post(vars.apiUrl + '/profile/retrieve-user-info', { jwt: token }, { headers: headers })
      .map(res => res.json());
  }
}
