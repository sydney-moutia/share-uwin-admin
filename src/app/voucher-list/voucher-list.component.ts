import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { NgClass } from '@angular/common';
import { Voucher } from '../pojo/voucher';
import { Shop } from '../pojo/shop';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { VoucherService } from '../service/voucher.service'
import { ShopAdminService } from '../service/shopadmin.service'
import { Message } from 'primeng/primeng';

@Component({
  //moduleId: module.id,
  selector: 'app-voucher-list',
  templateUrl: 'voucher-list.component.html',
  styleUrls: ['voucher-list.component.css'],
  providers: [VoucherService, ShopAdminService],

  //directives: [NgClass]
})
export class VoucherListComponent implements OnInit, OnDestroy {
  @Input() idShop: string;

  vouchers: Voucher[];
  selectedVoucher: Voucher;
  msgs: Message[] = [];
  sub: any;
  today: number;
  shopName: string;
  role: string;
  isAdmin: boolean;

  constructor(
    private voucherService: VoucherService,
    private route: ActivatedRoute
  ) { }

  getVouchers(idShop: string): void {
    this.voucherService.getVouchers(idShop).subscribe(
      vouchers => this.vouchers = vouchers,
      error => this.msgs.push({ severity: 'error', summary: 'Voucher List', detail: error })
    );
  }

  ngOnInit() {
    this.role = localStorage.getItem('auth_role');
    this.isAdmin = this.role === 'ADMIN';

    if (!this.idShop) {
      this.sub = this.route.params.subscribe(params => {
        this.idShop = params['id'];
      });

      this.shopName = localStorage.getItem('shop_name');
    }

    this.getVouchers(this.idShop);
    this.today = new Date().getTime();
  }

  onRowSelect(event) {
    this.selectedVoucher = event.data;
  }

  onNewItem() {
    this.selectedVoucher = new Voucher();
    this.selectedVoucher.idShop = this.idShop;
    //this.selectedVoucher.idInitiator = this.shop.owner.id;
    //this.selectedVoucher.fullnameInitiator = this.shop.owner.fName + " " + this.shop.owner.lName;
  }

  savedVoucher(voucher: Voucher): void {
    // update the voucher list is a new voucher has been created
    let indx = this.vouchers.findIndex(aVoucher => aVoucher === voucher);

    if (indx < 0) {
      this.vouchers.push(voucher);
    }

    this.selectedVoucher = voucher;

  }

  deletedVoucher(voucher: Voucher): void {
    // update the voucher list if a voucher has been deleted
    let indx = this.vouchers.findIndex(aVoucher => aVoucher === voucher);

    if (indx >= 0) {
      this.vouchers.splice(indx, 1);
    }

    this.selectedVoucher = null;

  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  onGoBack() {
    window.history.back();
  }


}
