import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import * as vars from '../../global-variable';

/*
  Generated class for the EventProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EventProvider {

  constructor(public http: Http) {
    console.log('Hello EventProvider Provider');
  }


  retrieveEventPosting() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(vars.apiUrl + '/event/retrieve-events', { headers: headers })
      .map(res => res.json());
  }

}
