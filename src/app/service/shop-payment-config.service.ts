import { Injectable } from '@angular/core';
import { HttpComService } from './httpcom.service'
import { Http } from '@angular/http';
import { ShopPaymentConfig } from '../pojo/shop_payment_config';

const endpoint = 'https://us-central1-uwin-201010.cloudfunctions.net/restApi/v1/shops/:shopId/shop-payment-config';

@Injectable()
export class ShopPaymentConfigService extends HttpComService {
  constructor(private http: Http) { super(); }

  cget(shopId: string) {
    return this.http.get(endpoint.replace(':shopId', shopId), { headers: this.headers })
      .map(response => response.json() as ShopPaymentConfig[])
      .catch((err) => this.handleError(err))
  }

}
