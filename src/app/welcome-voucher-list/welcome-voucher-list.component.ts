import { Component, OnInit } from '@angular/core';
import  { Voucher } from '../pojo/voucher';
import { VoucherService } from '../service/voucher.service';
import {take} from  'rxjs/operators/take';

@Component({
  selector: 'app-welcome-voucher-list',
  templateUrl: './welcome-voucher-list.component.html',
  styleUrls: ['./welcome-voucher-list.component.css'],
  providers: [VoucherService],
})
export class WelcomeVoucherListComponent implements OnInit {
  vouchers: Voucher[] | undefined;

  constructor(
    private voucherService: VoucherService,
  ) { }

  ngOnInit() {
    this.voucherService.fetchWelcomeVoucherList()
      .pipe(take(1))
      .subscribe((list) => this.vouchers = list as Voucher[]);
  }

  onGoBack(event: MouseEvent): void {
    event.preventDefault();
    window.history.back();
  }
}
