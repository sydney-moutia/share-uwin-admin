import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { VouchersGroup } from '../pojo/vouchers_group';
import { HttpComService } from "./httpcom.service";
import { Http } from "@angular/http";
import { environment } from "../../environments/environment";

@Injectable()
export class VouchersGroupService extends HttpComService{

  constructor(private http: Http) {
    super();
  }

  fetchAll(): Observable<VouchersGroup[]> {
    const url = environment.endpoints.vouchersGroup.list;

    return this.http
      .get(url, { headers: this.headers })
      .map((response) => response.json() as VouchersGroup[])
      .catch(this.handleError);
  }

  save(vouchersGroup: {name: string}): Observable<{}> {
    const url = environment.endpoints.vouchersGroup.list;

    return this.http
      .post(url, vouchersGroup, { headers: this.headers })
      .map(() => null)
      .catch(this.handleError);

  }
  
  saveVouchers(id: string, vouchers: string[]): Observable<void> {
    const url = `${environment.endpoints.vouchersGroup.list}/${id}/vouchers`;

    return this.http
      .post(url, vouchers, { headers: this.headers })
      .map(() => null)
      .catch(this.handleError);
  }
}
