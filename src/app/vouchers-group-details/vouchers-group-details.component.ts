import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Voucher } from "../pojo/voucher";
import { VouchersGroup } from "../pojo/vouchers_group";
import { VoucherService } from "../service/voucher.service";
import { VouchersGroupService } from "../service/vouchers-group.service";
import { Message } from 'primeng/primeng';
import { FormControl } from "@angular/forms";
import { combineLatest } from "rxjs/operators";
import { time } from "console";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Component({
  selector: "app-vouchers-group-details",
  templateUrl: "./vouchers-group-details.component.html",
  styleUrls: ["./vouchers-group-details.component.css"],
  providers: [VoucherService, VouchersGroupService],
})
export class VouchersGroupDetailsComponent implements OnInit, OnChanges {
  @Input() vouchersGroup: VouchersGroup;
  list$: Observable<Voucher[]>;
  list: Voucher[] = [];
  groupVouchers$: Observable<Voucher[]> | null = null;
  groupVouchers: Voucher[] = [];
  selectedGroupVouchers: Voucher | null;
  selectedAllVouchers: Voucher | null;
  isSaveBtnDisabled = false;
  msgs: Message[] = [];
  showExpiredVouchers = new FormControl('');
  showExpiredVouchers$ = new BehaviorSubject<boolean>(false);
  total = 0;

  constructor(
    private voucherService: VoucherService,
    private voucherGroupService: VouchersGroupService,
  ) { }

  ngOnInit() {
    this.showExpiredVouchers.valueChanges
      .map((v) => v === 'true')
      .subscribe(this.showExpiredVouchers$);

    this.list$ = this.showExpiredVouchers$
      .pipe(
        combineLatest<boolean, Voucher[], Voucher[]>(
          this.voucherService.cget(),
          (showExpired, list) => {
            if (showExpired) {
              return list;
            }

            return list.filter((v) => v.validityDate > Date.now())
          }
        )
      )
      .map((list) => {
        return this.list = list;
      })
      ;
    this.showExpiredVouchers.reset(false);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes["vouchersGroup"]) {
      return;
    }
    const group: VouchersGroup = changes["vouchersGroup"].currentValue;
    this.groupVouchers$ = this.voucherService.fetchByGroup(group.id)
      .map((list) => {
        this._updateTotal(list);
        return this.groupVouchers = list;
      });
  }

  _updateTotal(list: Voucher[]) {
    let sum = 0;
    for (const it of list) {
      sum += it.voucherValue;
    }
    this.total = sum;
  }

  onSelectGroupVouchers(event: any) {
    this.selectedAllVouchers = null;
  }

  onSelectAllVouchers(event: any) {
    this.selectedGroupVouchers = null;
  }

  moveToGroup(voucher: Voucher): void {
    this.groupVouchers.push(voucher);
    const index = this.list.indexOf(voucher);
    if (index > -1) {
      this.list.splice(index, 1);
    }
    this.selectedAllVouchers = null;
    this._updateTotal(this.groupVouchers);
  }

  moveToAll(voucher: Voucher): void {
    this.list.push(voucher);
    const index = this.groupVouchers.indexOf(voucher);
    if (index > -1) {
      this.groupVouchers.splice(index, 1);
    }
    this.selectedGroupVouchers = null;
    this._updateTotal(this.groupVouchers);
  }

  save(event: MouseEvent) {
    this.msgs = [];
    event.preventDefault();
    this.isSaveBtnDisabled = true;
    this.voucherGroupService.saveVouchers(
      this.vouchersGroup.id,
      this.groupVouchers.map((v) => v.id)).subscribe(
        () => {
          this.msgs.push({ severity: 'info', summary: 'Voucher List', detail: 'OK' });
          this.isSaveBtnDisabled = false;
        },
        (err) => {
          this.msgs.push({ severity: 'error', summary: 'Voucher List', detail: err });
          this.isSaveBtnDisabled = false;
        },
      );
  }
}
