import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { GiftVoucherService } from "../service/gift-voucher.service";
import { GiftVoucherCode } from "../pojo/gift_voucher_code";
import { Observable } from "rxjs/Observable";

@Component({
  selector: "app-gift-voucher-list",
  templateUrl: "./gift-voucher-list.component.html",
  styleUrls: ["./gift-voucher-list.component.css"],
})
export class GiftVoucherListComponent implements OnInit {
  @Input() idShop: string;
  shopName: string;
  sub: any;
  codes$: Observable<GiftVoucherCode[]> | undefined;
  codes: GiftVoucherCode[] = [];
  showPreloader = true;

  constructor(
    private giftVoucherService: GiftVoucherService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (!this.idShop) {
      this.sub = this.route.params.subscribe((params) => {
        this.idShop = params["id"];
      });
    }

    this.codes$ = this.giftVoucherService
      .fetchCodes(this.idShop)
      .map((codes) => {
        this.codes = codes;
        this.showPreloader = false;

        return codes;
      })
      .catch((err) => {
        this.showPreloader = false;
        return Observable.throw(err);
      });
  }

  onGoBack() {
    window.history.back();
  }
}
