import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthService } from './auth.service';
import { ProductMainCategory } from '../pojo/product_main_category';
import { Observable } from 'rxjs/Observable';

const _apiEndpoint = 'https://firestore.googleapis.com/v1/projects/uwin-201010/databases/(default)/documents/classifications/product/mainCategory?pageSize=1000';

@Injectable()
export class ProductMainCategoryService {

  constructor(private http: Http, private authService: AuthService) { }

  fetchAll(): Observable<ProductMainCategory[]> {
    return this.authService
      .getFirestoreToken()
      .switchMap(token => this.http.get(
        _apiEndpoint,
        { headers: new Headers({ 'Authorization': `Bearer ${token}` }) })
      )
      .map(res => res.json() as { documents: { fields: ProductMainCategory }[] })
      .map(snap => snap.documents.map(doc => doc.fields))
  }
}
