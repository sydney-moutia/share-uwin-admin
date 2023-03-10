import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpComService } from './httpcom.service';
import { Banner } from '../pojo/banner';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BannerService extends HttpComService {

  constructor(private http: Http) { super() }

  find(id: string): Observable<Banner> {
    return this.http.get(`https://us-central1-uwin-201010.cloudfunctions.net/restApi/v1/banners/${id}`, { headers: this.headers })
      .map(response => response.json() as Banner)
      .catch(this.handleError)
  }

  update(id: string, banner: { uri: string, published: boolean }): Observable<string> {
    return this.http
      .put(
        `https://us-central1-uwin-201010.cloudfunctions.net/restApi/v1/banners/${id}`,
        banner,
        { headers: this.headers }
      )
      .map(_ => id)
      .catch(this.handleError)
  }
}
