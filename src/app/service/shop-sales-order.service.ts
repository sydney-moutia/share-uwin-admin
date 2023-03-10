import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ShopSalesOrder } from '../pojo/shop_sales_order';
import { Observable } from 'rxjs/Observable';
import { HttpComService } from './httpcom.service';

const _endpoint = 'https://us-central1-uwin-201010.cloudfunctions.net/restApi/v1/shops/:shopId/sales-orders';

@Injectable()
export class ShopSalesOrderService extends HttpComService {

  constructor(private http: Http) {
    super();
  }

  cget(shopId: string): Observable<ShopSalesOrder[]> {
    return this.http
      .get(
        _endpoint.replace(':shopId', shopId),
        { headers: this.headers }
      )
      .map(res => res.json() as ShopSalesOrder[])
  }
}
