import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import {GeoLocation} from '../pojo/geolocation';

import 'rxjs/add/observable/throw';

@Injectable()
export class GeoCodingService {

  private geoCodingUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=";
  private key = "AIzaSyAxcQ2LrGkNUabB27tatwp_XZbPVD_j98M";
  private headers = new Headers({ 'Content-Type': 'application/json' });


  constructor(private http: Http) { }


  getGeoCoding(address : String): Observable<GeoLocation> {
    return this.http.get(this.geoCodingUrl + address + "&key=" + this.key)
      .map(response => (response.json().results.length > 0)? response.json().results[0].geometry.location:null as GeoLocation)
      .catch(this.handleError);
  }



  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
