import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Message } from 'primeng/primeng';
import { Item } from '../pojo/item';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { HttpComService } from './httpcom.service'
import { ProductExtService } from './product-ext.service';
import { combineLatest } from 'rxjs/operators';



@Injectable()
export class ItemService extends HttpComService {

  private itemInShopUrl = environment.restServer + "/admin/shops";
  private itemUrl = environment.restServer + "/admin/items";
  //private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http, private productService: ProductExtService) { super(); }

  getItems(idShop: string): Observable<Item[]> {
    const url = `https://us-central1-uwin-201010.cloudfunctions.net/restApi/v1/shops/${idShop}/items`

    return this.http.get(url, { headers: this.headers })
      .map(response => response.json() as Item[])
      .catch(this.handleError);
  }

  /*
    private handleError(error: any) {
      let myError = error.json().message;
      let errMsg = (myError) ? myError :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console instead
      return Observable.throw(errMsg);
    }
  */

  createOrUpdateItem(item: Item, idShop: string): Observable<string> {
    let urlUpdate: string = this.itemUrl + "/" + item.id;
    // NO SHOP IN ITEM let urlNew: string = this.itemInShopUrl + "/" + item.idShop + "/items";

    let urlNew: string = this.itemInShopUrl + "/" + idShop + "/items";


    let options = new RequestOptions({ headers: this.headers });
    let body = JSON.stringify(item);

    let url = (item.id === null) ? urlNew : urlUpdate;

    return this.http.put(url, body, { headers: this.headers })
      .map(response => response.json().id as string)
      .catch(this.handleError);
  }

  deleteItem(item: Item) {
    let urlDelete: string = this.itemUrl + "/" + item.id;
    return this.http.delete(urlDelete, { headers: this.headers })
      .map(response => response.json().status as string)
      .catch(this.handleError);
  }

}
