import { Injectable } from "@angular/core";
import { of } from "rxjs/observable/of";
import { MyWinMenuItem } from "../pojo/my_win_menu_item";
import { Observable } from "rxjs/Observable";
import { environment } from '../../environments/environment';
import { Http, RequestOptions } from '@angular/http';
import { HttpComService } from './httpcom.service'

@Injectable()
export class MyWinMenuItemService extends HttpComService {
  constructor(private http: Http) { super(); }

  fetchAll(): Observable<MyWinMenuItem[]> {
    const url = `${environment.firebaseRestApi}/v1/my-wins`;
    return this.http.get(url, { headers: this.headers })
      .map(response => response.json() as MyWinMenuItem[])
  }

  fetch(id: string): Observable<MyWinMenuItem> {
    const url = `${environment.firebaseRestApi}/v1/my-wins/${id}`;
    return this.http.get(url, { headers: this.headers })
      .map(response => response.json() as MyWinMenuItem)
  }

  update(id: string, cat: MyWinMenuItem): Observable<string> {
    const url = `${environment.firebaseRestApi}/v1/my-wins/${id}`;
    return this.http.put(url, cat, { headers: this.headers })
      .map(response => response.json() as {id: string})
      .map(({id}) => id);
  }
}
