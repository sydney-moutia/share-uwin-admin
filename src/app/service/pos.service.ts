import { Injectable }    from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { HttpComService } from './httpcom.service'
import { Router } from '@angular/router';


import { Pos } from '../pojo/pos';

import { environment } from '../../environments/environment';


@Injectable()
export class PosService extends HttpComService {

  private shopUrl = environment.restServer + "/admin/shops";

  constructor( private http: Http) {super(); }

  getPosList(idShop: String): Observable<Pos[]> {
     let url: string = this.shopUrl + "/" + idShop + "/pos";

    return this.http.get(url, { headers: this.headers })
      .map(response => response.json() as Pos[])
      .catch(this.handleError);
  }


  getPos(idShop: string, idPos: string): Observable<Pos> {

    let url: string = this.shopUrl + "/" + idShop + "/pos" + "/" + idPos;

    return this.http.get(url, { headers: this.headers })
      .map(response => response.json() as Pos)
      .catch(this.handleError);
  }  

  createOrUpdatePos(idShop: string, pos: Pos): Observable<string> {
    
  let urlUpdate: string =  this.shopUrl + "/" + idShop + "/pos" + "/" + pos.id;
  let urlNew: string =  this.shopUrl + "/" + idShop + "/pos" ;


  let options = new RequestOptions({ headers: this.headers });
  let body = JSON.stringify(pos);

  let url = (pos.id === null) ? urlNew : urlUpdate;

  return this.http.put(url, body, { headers: this.headers })
         .map(response => response.json().id as string)
         .catch(this.handleError);
    
    
  }

deletePos(idShop : string, pos: Pos) {
  let urlDelete: string =  this.shopUrl + "/" + idShop + "/pos" + "/" + pos.id;
   return this.http.delete(urlDelete, { headers: this.headers })
         .map(response => response.json().status as string)
         .catch(this.handleError);
  }
}
