import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Observable }     from 'rxjs/Observable';
import { Router } from '@angular/router';


@Injectable()
export class HttpComService {

  headers = new Headers();

  
  

  constructor() {
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        // if (authToken!==undefined) this.headers.append('Authorization', `Bearer ${authToken}`);
        if (authToken!==undefined) this.headers.append('Authorization', authToken);
  }

  
  protected handleError(error: any) {

    if (error.status && error.status === 401) {
      window.alert("Session timeout. You need to login again");
      window.location.href = '/';
    } 
    //this.router.navigate(['Login']);

    let myError = error.json().message;
    let errMsg = (myError) ? myError :
      error.status ? `${error.status} - ${error.statusText}` : ' Server error';
    //(error as any).msg = errMsg;
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);    
  }
}