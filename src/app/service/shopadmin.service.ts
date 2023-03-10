import { Injectable }    from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { ShopAdmin } from '../pojo/shopadmin';
import { Role } from '../pojo/role';
import { environment } from '../../environments/environment';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { HttpComService } from './httpcom.service'


@Injectable()
export class ShopAdminService extends HttpComService {

  private shopAdminInShopUrl = environment.restServer + "/admin/shops";
  private roleUrl = environment.restServer + "/admin/roleList";
  private shopAdminUrl = environment.restServer + "/admin/shopAdmins";

  constructor(private http: Http) { super(); }

  getShopAdmins(idShop: string, query: ShopAdminServiceQuery): Observable<ShopAdminServiceQueryResult> {
    let url: string;
    
    if (idShop !== null && idShop !== undefined)
        url = this.shopAdminInShopUrl + "/" + idShop + "/shopAdmins";
    else
        url = this.shopAdminUrl;

    return this.http.get(url, {search : "shopAdminQuery=" + JSON.stringify(query), headers: this.headers})
      .map(response => response.json() as ShopAdminServiceQueryResult)
      .catch(this.handleError);
  }


  getShopAdmin(idShopAdmin: string): Observable<ShopAdmin> {
    let url: string;
    
    url = this.shopAdminUrl + "/" + idShopAdmin;

    return this.http.get(url, { headers: this.headers})
      .map(response => response.json() as ShopAdmin)
      .catch(this.handleError);
  }  

  private cachierRole = '{ "id": 3, "label": "Cashier"}';

  getRoleList(): Observable<Role[]> {
    return this.http.get(this.roleUrl, { headers: this.headers })
      .map(response => response.json() as Role[])
      .map(roles => roles.filter(r => r.label !== 'Cashier'))
      .map(roles => {
        roles.push(JSON.parse(this.cachierRole) as Role);

        return roles;
      })
      .catch(this.handleError);
  } 

  deleteShopAdmin (shopAdmin: ShopAdmin) {
    let urlDelete: string =  this.shopAdminUrl + "/" + shopAdmin.id;
     return this.http.delete(urlDelete, { headers: this.headers })
           .map(response => response.json().status as string)
           .catch(this.handleError);
  }

  createOrUpdateShopAdmin(shopAdmin: ShopAdmin): Observable<string> {
    let urlUpdate: string =  this.shopAdminUrl + "/" + shopAdmin.id;
    // NO SHOP IN ITEM let urlNew: string = this.itemInShopUrl + "/" + item.idShop + "/items";
    
    let urlNew: string = this.shopAdminUrl;


    let options = new RequestOptions({ headers: this.headers });
    let body = JSON.stringify(shopAdmin);

    let url = (shopAdmin.id === undefined) ? urlNew : urlUpdate;

    return this.http.put(url, body, { headers: this.headers })
           .map(response => response.json().id as string)
           .catch(this.handleError);
  }  


  updateShopAdminShop(idShop: string, shopAdmins: ShopAdmin[]): Observable<string> {
    let url = this.shopAdminInShopUrl + "/" + idShop + "/shopAdmins";
    let options = new RequestOptions({ headers: this.headers });
    let body = JSON.stringify(shopAdmins);

    return this.http.put(url, body, { headers: this.headers })
           .map(response => response.json().id as string)
           .catch(this.handleError);
  }    

}



export class ShopAdminServiceQuery {
    constructor (
    public text: string,
    public skip: number,
    public limit: number,
    public sort: string,
    public order: number,
    public includeGhosts   : boolean,
    public includeUwinAdmin: boolean ) {}
}

export class ShopAdminServiceQueryResult {
    constructor (
    public text: string,
    public shopAdmins: ShopAdmin[],
    public nbResult  : number ) {}
}