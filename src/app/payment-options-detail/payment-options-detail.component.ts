import { Component, OnInit } from '@angular/core';
import { ShopPaymentConfigService } from '../service/shop-payment-config.service';
import { ActivatedRoute } from '@angular/router';
import { ShopPaymentConfig } from '../pojo/shop_payment_config';
import { Message } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable';
import { ShopService } from '../service/shop.service';
import { Shop } from '../pojo/shop';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-payment-options-detail',
  templateUrl: './payment-options-detail.component.html',
  styleUrls: ['./payment-options-detail.component.css'],
  providers: [ShopService],
})
export class PaymentOptionsDetailComponent implements OnInit {
  shop: Shop;
  paymentConfigs: ShopPaymentConfig;
  msgs: Message[] = [];
  form: FormGroup;

  constructor(
    private paymentConfigService: ShopPaymentConfigService,
    private route: ActivatedRoute,
    private shopService: ShopService,
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      paymentOnDeliveryEnabled: new FormControl('', null),
      mcbEnabled: new FormControl('', null),
      mcbMerchantId: new FormControl('', null),
      mcbMerchantDisplayName: new FormControl('', null),
      mcbMerchantUsername: new FormControl('', null),
      mcbMerchantApiPassword: new FormControl('', null),
    });

    this.getShopId()
      .switchMap(shopId => this.paymentConfigService.cget(shopId))
      .subscribe(
        configs => this.paymentConfigs = configs,
        error => this.msgs.push({ severity: 'error', summary: 'Shop Admins', detail: error })
      );

    this.getShopId()
      .switchMap(shopId => this.shopService.getShop(shopId))
      .subscribe(
        shop => this.shop = shop,
        error => this.msgs.push({ severity: 'error', summary: 'Shop Admins', detail: error })
      );
  }

  getShopId(): Observable<string> {
    return this.route.params.map(params => params['id']);
  }

  onGoBack() {
    window.history.back();
  }
}