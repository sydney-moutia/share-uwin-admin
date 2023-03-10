import { Injectable }    from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Item } from '../pojo/item';
import { Coupon } from '../pojo/coupon';
import { User } from '../pojo/user';
import { environment } from '../../environments/environment';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { HttpComService } from './httpcom.service'
import { ProductExtService } from './product-ext.service';
import { combineLatest } from 'rxjs/operators';


@Injectable()
export class CouponService extends HttpComService {

  private itemInCouponUrl = environment.restServer + "/admin/shops";
  private couponUrl = environment.restServer + "/admin/coupons";
  //private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http, private productService: ProductExtService) { super(); }


  getCouponUsers (coupon : Coupon): Observable<User[]> {
    
    let url: string =  this.couponUrl + "/" + coupon.id + "/users";

    return this.http.get(url, { headers: this.headers })
      .map(response => response.json() as User[])
      .catch(this.handleError);
  }

  getItems(idShop: string): Observable<Coupon[]> {

    let url: string = this.itemInCouponUrl + "/" + idShop + "/coupons";

    return this.http.get(url, { headers: this.headers })
      .map(response => response.json() as Coupon[] || [])
      .pipe(combineLatest(this.productService.fetchByShopId(idShop), (coupons, products) => {
        const prodsId = products
          .filter(prod => prod.isArchive.booleanValue === true)
          .map(prods => prods.id.stringValue);

        return (coupons as Coupon[]).filter(c => prodsId.indexOf(c.idItem) === -1);
      }))
      .catch(this.handleError);
  }

  createOrUpdateCoupon(idShop: string, coupon: Coupon): Observable<string> {
    let urlUpdate: string =  this.couponUrl + "/" + coupon.id;
    let urlNew: string = this.itemInCouponUrl + "/" + idShop + "/coupons";


    let options = new RequestOptions({ headers: this.headers });
    let body = JSON.stringify(coupon);

    let url = (coupon.id === null) ? urlNew : urlUpdate;

    return this.http.put(url, body, { headers: this.headers })
           .map(response => response.json().id as string)
           .catch(this.handleError);
  }  

  deleteCoupon (coupon: Coupon) {
     let urlDelete: string =  this.couponUrl + "/" + coupon.id;
     return this.http.delete(urlDelete, { headers: this.headers })
           .map(response => response.json().status as string)
           .catch(this.handleError);
  }  

/*
  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
  */
}
