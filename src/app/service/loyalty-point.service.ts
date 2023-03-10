import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { UserShopLoyaltyPoint } from '../pojo/user_shop_loyalty_point';
import { HttpComService } from './httpcom.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoyaltyPointService extends HttpComService {

  constructor(
    private http: Http,
  ) {
    super();
  }

  cgetWhereShop(shopId: string): Observable<UserShopLoyaltyPoint[]> {
    return this.http.get(environment.endpoints.loyaltyPoints.list.replace(':shopId', shopId), { headers: this.headers })
      .map(response => response.json() as UserShopLoyaltyPoint[])
      .catch(this.handleError);
  }
}
