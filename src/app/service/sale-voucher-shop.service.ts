import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { of } from 'rxjs/observable/of';

const _apiEndpoint = 'https://firestore.googleapis.com/v1/projects/uwin-201010/databases/(default)/documents/saleVoucherShops';

@Injectable()
export class SaleVoucherShopService {

  constructor(private http: Http, private authService: AuthService) { }

  find(id: string): Observable<SaleVoucherShop> {
    return this.authService
      .getFirestoreToken()
      .switchMap(token => this.http.get(
        `${_apiEndpoint}/${id}`,
        { headers: new Headers({ 'Authorization': `Bearer ${token}` }) })
      )
      .map(res => res.json().fields as SaleVoucherShop)
      .catch(err => {
        if (err.status === 404) {
          return of(<SaleVoucherShop>{
            id: {
              stringValue: id
            },
            enabled: {
              booleanValue: false
            }
          });
        }

        return Observable.throw(err)
      });
  }

  save(saleVoucherShop: SaleVoucherShop): Observable<SaleVoucherShop> {
    return this.authService
      .getFirestoreToken()
      .switchMap(token => this.http.patch(
        `${_apiEndpoint}/${saleVoucherShop.id.stringValue}`,
        { fields: saleVoucherShop },
        { headers: new Headers({ 'Authorization': `Bearer ${token}` }) })
      )
      .map(res => res.json().fields as SaleVoucherShop);
  }

}
