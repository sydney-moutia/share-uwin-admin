import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { Http, Headers } from '@angular/http';
import { Item } from '../pojo/item';
import { of } from 'rxjs/observable/of';
import { HttpComService } from './httpcom.service';

const _apiEndpoint = 'https://firestore.googleapis.com/v1/projects/uwin-201010/databases/(default)/documents/shopExt';
const _productsCollectionPath = `products`

@Injectable()
export class ProductExtService extends HttpComService {

  constructor(private http: Http, private authService: AuthService) {
    super();
  }

  create(shopId: string, item: Item): ProductExt {
    return {
      id: { stringValue: (item && item.id ? item.id : '') },
      category1: { stringValue: '' },
      subcategory1: { stringValue: '' },
      category2: { stringValue: '' },
      subcategory2: { stringValue: '' },
      shopId: { stringValue: shopId },
      archivedAt: { integerValue: 0 },
      isArchive: { booleanValue: false },
      normalPrice: { integerValue: 0 },
      quantityAvailable: { integerValue: 0 },
    };
  }

  fetch(shopId: string, item: Item | null): Observable<ProductExt> {
    if (!item) {
      return of(this.create(shopId, null));
    }

    if (!item.id) {
      return of(this.create(shopId, null));
    }

    return this.authService
      .getFirestoreToken()
      .switchMap(token => this.http.get(
        `${_apiEndpoint}/${shopId}/${_productsCollectionPath}/${item.id}`,
        { headers: new Headers({ 'Authorization': `Bearer ${token}` }) }
      ))
      .map(res => res.json() as { fields: ProductExt })
      .map(data => data.fields)
      .map(({
        id,
        shopId,
        archivedAt,
        isArchive,
        category1,
        subcategory1,
        category2,
        subcategory2,
        normalPrice,
        quantityAvailable
      }) => {
        return {
          id,
          shopId,
          archivedAt,
          isArchive,
          category1: category1 || { stringValue: '' },
          subcategory1: subcategory1 || { stringValue: '' },
          category2: category2 || { stringValue: '' },
          subcategory2: subcategory2 || { stringValue: '' },
          normalPrice: normalPrice || { integerValue: 0 },
          quantityAvailable: quantityAvailable || { integerValue: 0 },
        };
      })
      .catch(err => {
        if (err.status === 404) {
          return of(this.create(shopId, item));
        }

        return Observable.throw(err);
      });
  }


  fetchByShopId(shopId: string): Observable<ProductExt[]> {
    return this.authService
      .getFirestoreToken()
      .switchMap(token => this.http.get(
        `${_apiEndpoint}/${shopId}/${_productsCollectionPath}?pageSize=1000`,
        { headers: new Headers({ 'Authorization': `Bearer ${token}` }) })
      ).map(res => res.json())
      .map(snap => {
        if (snap.documents) {
          return snap.documents.map(({ fields, name }) => {
            if (!fields.id || !fields.id.stringValue) {
              fields.id = { stringValue: name.split('/').pop() }
            }

            return fields;
          });
        }

        return [] as ProductExt[];
      })
      .catch(err => {
        if (err.status === 404) {
          return [];
        }

        return Observable.throw(err);
      })
  }

  save(prod: ProductExt): Observable<ProductExt> {
    return this.authService
      .getFirestoreToken()
      .switchMap(token => this.http.patch(
        `${_apiEndpoint}/${prod.shopId.stringValue}/products/${prod.id.stringValue}`,
        { fields: prod },
        { headers: new Headers({ 'Authorization': `Bearer ${token}` }) })
      )
      .map(res => res.json().fields as ProductExt);
  }

  archive(shopId: string, item: Item): Observable<void> {
    const url = `https://us-central1-uwin-201010.cloudfunctions.net/restApi/v1/shops/${shopId}/items/${item.id}/archive`;
    const headers = this.headers;

    return this.http.post(url, '', { headers }).map(res => null);
  }
}
