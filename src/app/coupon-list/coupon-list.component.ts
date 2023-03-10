import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import {NgClass} from '@angular/common';
import { Coupon } from '../pojo/coupon';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CouponService } from '../service/coupon.service'
import {Message} from 'primeng/primeng';
import { ItemService } from '../service/item.service';
import { Item } from '../pojo/item';

@Component({
  //moduleId: module.id,
  selector: 'app-coupon-list',
  templateUrl: 'coupon-list.component.html',
  styleUrls: ['coupon-list.component.css'],
  providers: [CouponService, ItemService],
  //directives: [NgClass]
})
export class CouponListComponent implements OnInit, OnDestroy {
 @Input() idShop: string;
 @Input() refreshMe: boolean;

  coupons: Coupon[];
  selectedCoupon: Coupon;

  msgs: Message[] = [];  

  today : number;

  sub: any;

  shopName: string;

  items: Item[] = [];

  constructor(
      private couponService: CouponService,
      private route: ActivatedRoute,
      private itemService: ItemService
  ) {}

  getCoupons(idShop : string): void {
    this.couponService.getItems(idShop).subscribe(
      coupons => this.coupons = coupons,
      error =>  this.msgs.push({severity:'error', summary:'Coupon List', detail:error})
    );  
  }

    getItems(idShop: string): void {
    this.itemService.getItems(idShop).subscribe(
      items => {
        this.items = items;
      },
      error => this.msgs.push({ severity: 'error', summary: 'Item List', detail: error })
    );
  }

  

  ngOnInit() { 

    if (!this.idShop) {
          this.sub = this.route.params.subscribe(params => {
            this.idShop = params['id'];
          });
      }

    this.getCoupons(this.idShop);
    this.getItems(this.idShop);
    this.today = new Date().getTime();
    this.shopName = localStorage.getItem('shop_name');
  }

  onRowSelect (event) {
    this.selectedCoupon = event.data;
  }

  onNewItem() {
    this.selectedCoupon = new Coupon();
  }  

  ngOnChanges(changes: SimpleChanges) {

    if (changes['refreshMe'] != undefined) {

      let changedItem = changes['refreshMe'].currentValue;
      if (changedItem != undefined && changedItem != null) {
        
      this.getCoupons(this.idShop);

      }
      this.selectedCoupon = null; 
    }
  }  

  ngOnDestroy(){
        if (this.sub) this.sub.unsubscribe();
  }

  onGoBack() {
    window.history.back();
  }

  deletedCoupon (coupon: Coupon) : void {
    this.selectedCoupon = null;
  }


}
