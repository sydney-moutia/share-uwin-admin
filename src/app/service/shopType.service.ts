import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { ShopType } from "../pojo/shopType";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/throw";
import { HttpComService } from "./httpcom.service";

@Injectable()
export class ShopTypeService extends HttpComService {
  private shopTypeUrl = environment.restServer + "/admin/shopTypes";

  constructor(private http: Http) {
    super();
  }

  getShopTypes(): Observable<ShopType[]> {
    let list: ShopType[];
    return this.http
      .get(this.shopTypeUrl, { headers: this.headers })
      .map((response) => response.json() as ShopType[])
      .switchMap((l) => {
        list = l;
        const url = `${environment.firebaseRestApi}/v1/shop-types`;
        return this.http.get(url, { headers: this.headers });
      })
      .map((response) => {
        let stMap = {};
        for (let st of response.json()) {
          stMap[st.id] = st;
        }

        const shopTypeList = [];
        for (let st of list) {
          if (stMap[st.id]) {
            shopTypeList.push(Object.assign({}, st, stMap[st.id]));
          } else {
            shopTypeList.push(
              Object.assign({ position: 0, publishedOnWin: false }, st)
            );
          }
        }
        shopTypeList.sort((a, b) => (a.position > b.position ? 1 : -1));

        return shopTypeList;
      })
      .catch(this.handleError);
  }

  getShopType(id: String): Observable<ShopType> {
    let st: ShopType;
    return this.http
      .get(this.shopTypeUrl + "/" + id, { headers: this.headers })
      .map((response) => response.json() as ShopType)
      .switchMap((shopType) => {
        st = shopType;
        const url = `${environment.restServer}/v1/shop-types/${id}`;
        return this.http.get(url, { headers: this.headers });
      })
      .map((response) => {
        response.json() as ShopType;
        return Object.assign(
          {
            publishedOnWin: false,
            position: 0,
          },
          st,
          response.json()
        );
      })
      .catch(this.handleError);
  }

  deleteShopType(shopType: ShopType) {
    let urlDelete: string = this.shopTypeUrl + "/" + shopType.id;
    return this.http
      .delete(urlDelete, { headers: this.headers })
      .map((response) => response.json().status as string)
      .catch(this.handleError);
  }

  createOrUpdateShopType(shopType: ShopType): Observable<string> {
    let urlUpdate: string = this.shopTypeUrl + "/" + shopType.id;
    let urlNew: string = this.shopTypeUrl;

    let options = new RequestOptions({ headers: this.headers });

    let url = shopType.id === undefined ? urlNew : urlUpdate;

    return this.http
      .put(
        url,
        { id: shopType.id, name: shopType.name },
        { headers: this.headers }
      )
      .map((response) => response.json().id as string)
      .switchMap((id) => {
        shopType.id = id;
        const url2 = `${environment.firebaseRestApi}/v1/shop-types/${id}`;
        return this.http.put(url2, shopType, { headers: this.headers });
      })
      .map((response) => response.json().id as string)
      .catch(this.handleError);
  }
}
