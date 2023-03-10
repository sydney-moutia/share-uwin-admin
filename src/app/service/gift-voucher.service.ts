import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { AuthService } from "./auth.service";
import { Http, Headers } from "@angular/http";
import { of } from "rxjs/observable/of";
import { GiftVoucherCode } from "../pojo/gift_voucher_code";
import { HttpComService } from './httpcom.service'
import { environment } from '../../environments/environment';

const _apiEndpoint =
  "https://firestore.googleapis.com/v1/projects/uwin-201010/databases/(default)/documents/giftVouchers";

@Injectable()
export class GiftVoucherService extends HttpComService {

  constructor(private authService: AuthService, private http: Http) {
    super();
  }

  collection(shopId: string): Observable<GiftVoucher[]> {
    return this.authService
      .getFirestoreToken()
      .switchMap((token) =>
        this.http.get(`${_apiEndpoint}`, {
          headers: new Headers({ Authorization: `Bearer ${token}` }),
        })
      )
      .map((res) => res.json().documents as any[])
      .map((docs) => docs.map((doc) => doc.fields as GiftVoucher));
  }

  fetchCodes(shopId: string): Observable<GiftVoucherCode[]> {
    const url = `${environment.firebaseRestApi}/v1/shops/${shopId}/gift-voucher-code`;

    return this.http.get(url, { headers: this.headers})
      .map((res) => res.json() as GiftVoucherCode[])
      .catch(this.handleError);
  }
}

