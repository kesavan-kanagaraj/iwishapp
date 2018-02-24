import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the YaziApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class YaziApiProvider {
  private baseUrl = 'http://www.vlsitechnology.com';
  private eCardsUrl : string = '/api/ecards';

  constructor(public http: HttpClient) {
    console.log('Hello YaziApiProvider Provider');
  }

  getEcards(){
    return new Promise(resolve => {
      console.log(`${this.baseUrl + this.eCardsUrl}`);
        this.http.get(`${this.baseUrl + this.eCardsUrl}`)
            .subscribe(res => resolve(res));
    });
}

}
