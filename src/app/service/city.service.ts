import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Message} from 'primeng/primeng';
import { City } from '../pojo/city';
import { environment } from '../../environments/environment';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { HttpComService } from './httpcom.service'

@Injectable()
export class CityService extends HttpComService {

 private cityUrl = environment.restServer + "/admin/cities";
 // private headers = new Headers({ 'Content-Type': 'application/json' });


  constructor(private http: Http) { super(); }

  getCities(): Observable<City[]> {
    return this.http.get(this.cityUrl, { headers: this.headers })
      .map(response => response.json() as City[])
      .catch(this.handleError);
  }
 
 /*
  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
  */
}
