import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Headers, Http, RequestOptions } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/throw";
import { Voucher, VoucherUsage } from "../pojo/voucher";
import { HttpComService } from "./httpcom.service";
import { VoucherCode } from "../pojo/voucher_code";
import { of } from "rxjs/observable/of";

@Injectable()
export class VoucherService extends HttpComService {
  private itemInShopUrl = environment.restServer + "/admin/shops";
  // private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http) {
    super();
  }

  cget(): Observable<Voucher[]> {
    const url = environment.endpoints.vouchers.adminList;

    return this.http
      .get(url, { headers: this.headers })
      .map((response) => response.json() as Voucher[])
      .catch(this.handleError);

  }

  fetchByGroup(groupId: string): Observable<Voucher[]> {
    const url = environment.endpoints.vouchers.adminList;

    return this.http
      .get(`${url}?group=${groupId}`, { headers: this.headers })
      .map((response) => response.json() as Voucher[])
      .catch(this.handleError);
  }

  getVouchers(idShop: string): Observable<Voucher[]> {
    const url = environment.endpoints.vouchers.list.replace(":shopId", idShop);

    return this.http
      .get(url, { headers: this.headers })
      .map((response) => response.json() as Voucher[])
      .catch(this.handleError);
  }

  createOrUpdateVoucher(voucher: Voucher): Observable<string> {
    let options = new RequestOptions({ headers: this.headers });

    let body = JSON.stringify(voucher);

    if (voucher.id === null || voucher.id === undefined) {
      const url: string = environment.endpoints.vouchers.create.replace(
        ":shopId",
        voucher.idShop
      );

      return this.http
        .post(url, body, { headers: this.headers })
        .map((response) => response.json().id as string)
        .catch(this.handleError);
    } else {
      const url = environment.endpoints.vouchers.update
        .replace(":shopId", voucher.idShop)
        .replace(":voucherId", voucher.id);

      return this.http
        .put(url, body, { headers: this.headers })
        .map((response) => response.json().id as string)
        .catch(this.handleError);
    }
  }

  deleteVoucher(voucher: Voucher) {
    let urlDelete: string =
      this.itemInShopUrl +
      "/" +
      voucher.idShop +
      "/vouchers" +
      "/" +
      voucher.id;
    return this.http
      .delete(urlDelete, { headers: this.headers })
      .map((response) => response.json().status as string)
      .catch(this.handleError);
  }

  getUsers(idShop: string, idVoucher: string): Observable<VoucherUsage[]> {
    let url: string =
      this.itemInShopUrl +
      "/" +
      idShop +
      "/vouchers" +
      "/" +
      idVoucher +
      "/users";

    return this.http
      .get(url, { headers: this.headers })
      .map((response) => response.json() as VoucherUsage[])
      .catch(this.handleError);
  }

  sendNotification(
    shopId: string,
    voucherId: string,
    excludes: string[]
  ): Observable<void> {
    return this.http
      .post(
        `https://us-central1-uwin-201010.cloudfunctions.net/restApi/v1/shops/${shopId}/vouchers/${voucherId}/send-notification`,
        { excludes },
        { headers: this.headers }
      )
      .map(() => null);
  }

  getCodes(shopId: string, voucherId: string): Observable<VoucherCode[]> {
    return this.http
      .get(
        environment.voucherCodeListEndpoint
          .replace(":shopId", shopId)
          .replace(":voucherId", voucherId),
        { headers: this.headers }
      )
      .map((res) => res.json() as VoucherCode[])
      .catch((err, caught) => {
        console.error(err);

        return caught;
      });
  }

  addSingleCodeVoucherQuantity(
    shopId: string,
    voucherId: string,
    quantity: number
  ): Observable<void> {
    return this.http
      .post(
        environment.endpoints.vouchers.addSingleVoucherQuantity
          .replace(":shopId", shopId)
          .replace(":voucherId", voucherId),
        { quantity },
        { headers: this.headers }
      )
      .map(() => null);
  }

  fetchWelcomeVoucherList(): Observable<Voucher[]> {
    return this.http
      .get(environment.endpoints.vouchers.welcomeVouchers, {
        headers: this.headers,
      })
      .map((res) => res.json() as Voucher[]);
  }

  distributeToAll(voucherId: string): Observable<boolean> {
    return this.http
      .post(
        environment.endpoints.vouchers.distributeToAll.replace(
          ":voucherId",
          voucherId
        ),
        { headers: this.headers }
      )
      .map((_) => true);
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
