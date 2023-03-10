import { Injectable }    from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Item } from '../pojo/item';
import { FlashSell, FlashSellUsage } from '../pojo/flashsell';
import { environment } from '../../environments/environment';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { HttpComService } from './httpcom.service'
import { combineLatest } from 'rxjs/operators';
import { ProductExtService } from './product-ext.service';


@Injectable()
export class FlashSellService extends HttpComService  {

  private itemInShopUrl = environment.restServer + "/admin/shops";
  private flashSelllUrl = environment.restServer + "/admin/flashsells";
  //private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http, private productService: ProductExtService) { super(); }

  getItems(idShop: string): Observable<FlashSell[]> {

    let url: string = this.itemInShopUrl + "/" + idShop + "/flashSells";

    return this.http.get(url, { headers: this.headers })
      .map(response => response.json() as FlashSell[])
      .pipe(combineLatest(this.productService.fetchByShopId(idShop), (flashsell, products) => {
        const prodsId = products
          .filter(prod => {
            if (!prod.isArchive) {
              return true;
            }

            return prod.isArchive.booleanValue !== true;
          })
          .map(prods => prods.id.stringValue);

        return (flashsell as FlashSell[]).filter(fs => prodsId.indexOf(fs.idItem) !== -1 || fs.state !== 'INACTIVE');
      }));
  }


  getUsers(idShop: string, idFlashsell: string): Observable<FlashSellUsage[]> {

    //let url: string =  this.itemInShopUrl + "/" + idShop + "/flashSells" + "/" + idFlashsell + "/users";

    let url: string =  this.flashSelllUrl + "/" + idFlashsell + "/users";

    return this.http.get(url, { headers: this.headers })
      .map(response => response.json() as FlashSellUsage[])
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
  


  createOrUpdateItem(idShop: string, flashsell: FlashSell): Observable<string> {
    
  //let urlUpdate: string =  this.itemInShopUrl + "/" + idShop + "/flashSells" + "/" + flashsell.id;
  let urlUpdate: string =  this.flashSelllUrl + "/" + flashsell.id
  let urlNew: string =  this.itemInShopUrl + "/" + idShop + "/flashSells" ;

  flashsell.idShop = idShop;

  let options = new RequestOptions({ headers: this.headers });
  let body = JSON.stringify(flashsell);

  let url = (flashsell.id === null) ? urlNew : urlUpdate;

  return this.http.put(url, body, { headers: this.headers })
         .map(response => response.json().id as string)
         .catch(this.handleError);
    
    
  }

  deleteFlashsell(idShop : string, flashsell: FlashSell) {
  //let urlDelete: string =  this.itemInShopUrl + "/" + idShop + "/flashSells" + "/" + flashsell.id;
  let urlDelete: string =  this.flashSelllUrl + "/" + flashsell.id
   return this.http.delete(urlDelete, { headers: this.headers })
         .map(response => response.json().status as string)
         .catch(this.handleError);
  }

  copyInto(source: FlashSell, dest: FlashSell): void {
    if (source != null) {
      /*dest.id = source.id;
      dest.discountValue = source.discountValue;
      dest.idItem = source.idItem;
      dest.name = source.name;
      dest.photoPath = source.photoPath;
      dest.priceItem = source.priceItem;
      dest.running = source.running;
      dest.state = source.state;
      dest.description = source.description;*/

    for (var key in source) {
        dest[key] = this.cloneObject(source[key]);
    }

     // dest = Object.assign({}, source);

    }
  }

  cloneObject(obj) : Object {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
  }

}
