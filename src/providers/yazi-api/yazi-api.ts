import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { UriHelpers } from '../../helpers/helpers';
import 'rxjs/add/operator/map';
import { HttpResponse } from '@angular/common/http/src/response';

/*
  Generated class for the YaziApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class YaziApiProvider {




  constructor(public http: HttpClient) {
  }


  getEcards(categoryName: string, socialId: string) {
    var requestUrl = categoryName == 'all' ? UriHelpers.eCardsUrl : UriHelpers.eCardsByCategoryUrl.replace('category-name', categoryName);  
    requestUrl = socialId == "" ? requestUrl : requestUrl+"?socialId="+socialId;
    return new Promise(resolve => {
      this.http.get(`${UriHelpers.baseUrl + requestUrl}`)
        .subscribe(res => {
          resolve(res);
        });
    });
  }

  getEcardsWithPagination(categoryName: string, socialId: string, paginationUrl: string) {
    var requestUrl = "";
    if((categoryName == 'all' || categoryName == '' || categoryName == undefined) && paginationUrl==""){
     requestUrl = `${UriHelpers.baseUrl + UriHelpers.eCardsPaginationUrlGenral}`
    }
    else{
      requestUrl = paginationUrl == "" ? `${UriHelpers.baseUrl + UriHelpers.eCardsPaginationUrl.replace('category-name',categoryName)}` : paginationUrl;
    }
    requestUrl = socialId == "" ? requestUrl : requestUrl+"&socialId="+socialId;
    return new Promise(resolve => {
      this.http.get(`${requestUrl}`,{ observe: 'response' })
        .subscribe(res => {
          resolve(<any>res);
        });
    });
  }

  getEcard(cardId:string,socialId: string) {
    
    var requestUrl = UriHelpers.eCardUrl.replace('id', cardId);  
    requestUrl = socialId == "" ? requestUrl : requestUrl+"?socialId="+socialId;
    return new Promise(resolve => {
      this.http.get(`${UriHelpers.baseUrl + requestUrl}`)
        .subscribe(res => {
          resolve(res);
        });
    });
  }

  getFavorities(socialId: string) {
    
    var requestUrl = UriHelpers.favoritesPostUrl.replace('socialId', socialId);  
    return new Promise(resolve => {
      this.http.get(`${UriHelpers.baseUrl + requestUrl}`)
        .subscribe(res => {
          
          resolve(res);
        });
    });
  }

  putService(url:string,data:any) {
    
    return new Promise(resolve => {
      this.http.put(url,data)
        .subscribe(res => resolve(res));
    });
  }

  postService(url: string, param: any): Promise<any> {
    //var body = JSON.stringify(param);
    
    var options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http
        .post(url, param, options)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
    }  

    private extractData(res: Response) {
        return res;
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}


