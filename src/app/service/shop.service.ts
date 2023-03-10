import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { HttpComService } from './httpcom.service'
import { Router } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { Shop } from '../pojo/shop';
import { Frequency } from '../pojo/frequency';
import { ShopJoin } from '../pojo/shop_join';
import { environment } from '../../environments/environment';


@Injectable()
export class ShopService extends HttpComService {

  private shopUrl = environment.restServer + "/admin/shops";
  private frequencyUrl = environment.restServer + "/admin/frequencyList";
  //private headers = new Headers({ 'Content-Type': 'application/json' });


  constructor(private http: Http) { super(); }

  getShops(): Observable<Shop[]> {
    //let options = new RequestOptions({ headers: this.headers });
    return this.http.get(this.shopUrl, { headers: this.headers })
      .map(response => response.json() as Shop[])
      .catch((err) => this.handleError(err))
    //.catch(this.handleError.bind(this));
  }


  getLoyaltyShops(): Observable<Shop[]> {
    return this
      .getShops()
      .map(shList => shList.filter(sh => sh && sh.shopType && sh.shopType.id === "5e6b31a75f665034a0078fb5"))
  }

  getLogisticProviderShops(): Observable<Shop[]> {
    return this
      .getShops()
      .map(shList => shList.filter(sh => sh && sh.shopType && sh.shopType.id === "5e826fb45f66506244be5b37"))
  }


  getShop(id: String): Observable<Shop> {
    return this.http.get(this.shopUrl + "/" + id, { headers: this.headers })
      .map(response => response.json() as Shop)
      .catch(this.handleError);
  }

  createOrUpdateShop(shop: Shop): Observable<string> {
    let options = new RequestOptions({ headers: this.headers });
    let body = JSON.stringify(shop);

    let url = (shop.id === null) ? this.shopUrl : this.shopUrl + "/" + shop.id;

    return this.http.put(url, body, { headers: this.headers })
      .map(response => response.json().id as string)
      .catch(this.handleError);
  }

  getFrequencyList(): Observable<Frequency[]> {
    return this.http.get(this.frequencyUrl, { headers: this.headers })
      .map(response => response.json() as Frequency[])
      .catch(this.handleError);
  }

  saveJoin(shop: ShopJoin): Observable<String> {
    const url = `${environment.visitMauritiusApi}/v1/shops/${shop.id}`
    return this.http.put(url, shop, { headers: this.headers })
      .map((_) => shop.id);
  }
}
