import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment_ from 'moment';
import { DateModel, DatePickerOptions } from 'ng2-datepicker';
import { FileUpload, Message } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../environments/environment';
import { Person } from '../pojo/person';
import { Voucher, VoucherUsage } from '../pojo/voucher';
import { VoucherCode } from '../pojo/voucher_code';
import { ShopAdminService, ShopAdminServiceQuery } from '../service/shopadmin.service';
import { UtilsService } from '../service/utils.service';
import { VoucherService } from '../service/voucher.service';

const moment: any = (<any>moment_).default || moment_;

@Component({
  selector: 'app-voucher-detail',
  templateUrl: 'voucher-detail.component.html',
  styleUrls: ['voucher-detail.component.css'],
  providers: [VoucherService],
})


export class VoucherDetailComponent implements OnInit, OnChanges, OnDestroy {
  @Input() voucher: Voucher;
  @Input() idShop: string;
  @Output() saved: EventEmitter<any> = new EventEmitter();
  @Output() deleted: EventEmitter<any> = new EventEmitter();
  @ViewChild('aFileUpload') set content(content: FileUpload) {
    console.log('aFileUpload', content);
    this.myFileUpload = content;
  }
  myFileUpload: FileUpload;
  @ViewChild('voucheCodeFileUpload') set voucherContent(content: FileUpload) {
    this.voucherFileUpload = content;
    if (this.voucherFileUpload) {
      this.voucherFileUpload.url = environment.voucherCodeUploadEndpoint
        .replace(':shopId', this.voucher.idShop)
        .replace(':voucherId', this.voucher.id);
    }
  }
  voucherFileUpload: FileUpload;
  voucherFile
  userformVoucher: FormGroup;
  voucherCopy: Voucher = new Voucher();
  msgs: Message[] = [];
  shopAdmins: Person[];
  voucherUsageList: VoucherUsage[] = [];
  initiatorisAdmin: boolean = false;
  validityDateOptions: DatePickerOptions;
  validityDateModel: DateModel;
  initialized: boolean = false;
  voucherDistResult: any;
  role: string;
  isAdmin: boolean;
  codes$: Observable<VoucherCode[]>;
  codes: VoucherCode[];
  showVoucherCodeListSpinner = true;
  useVoucherCodeSub: Subscription;
  useVoucherCode: boolean;
  useSingleVoucherCodeSub: Subscription;
  useSingleVoucherCode: boolean;
  quantityForm: FormGroup;
  distributeToAllDisabled: boolean;

  constructor(
    private voucherService: VoucherService,
    private shopAdminService: ShopAdminService,
    private formBuilder: FormBuilder
  ) { }

  enableFormControls(enable: boolean): void {
    if (enable) {
      this.userformVoucher.get('name').enable();
      this.userformVoucher.get('value').enable();
      this.userformVoucher.get('initiator').enable();
    } else {
      if (this.isAdmin) {
        this.userformVoucher.get('name').enable();
      } else {
        this.userformVoucher.get('name').disable();
      }
      this.userformVoucher.get('value').disable();
      this.userformVoucher.get('initiator').disable();
    }
  }


  ngOnInit() {
    if (!this.initialized) {

      this.role = localStorage.getItem('auth_role');
      this.isAdmin = this.role === 'ADMIN';

      this.quantityForm = new FormGroup({
        quantity: new FormControl('', Validators.required),
      });

      this.userformVoucher = this.formBuilder.group({
        'initiator': ['', Validators.required],
        'name': ['', Validators.required],
        'value': ['value:0', Validators.required],
        'validityDate': ['value:0', Validators.required],
        'useVoucherCode': ['', Validators.required],
        'useSingleVoucherCode': [''],
        'singleVoucherCode': [''],
      });

      //if (this.validityDateModel == null) {
      this.validityDateModel = new DateModel();
      this.validityDateOptions = new DatePickerOptions();
      this.validityDateOptions.format = "DD/MM/YYYY";
      // }

      const uvcfc = this.userformVoucher.get('useSingleVoucherCode');
      this.useVoucherCodeSub = this.userformVoucher.get('useVoucherCode')
        .valueChanges
        .subscribe(uvc => {
          this.useVoucherCode = uvc;
          if (uvc) {
            uvcfc.enable();
            uvcfc.reset(false);
          } else {
            uvcfc.disable();
            uvcfc.reset(null);
          }
        });

      const svcCtrl = this.userformVoucher.get('singleVoucherCode');
      this.useSingleVoucherCodeSub = uvcfc
        .valueChanges
        .subscribe(svc => {
          this.useSingleVoucherCode = svc;
          if (svc) {
            svcCtrl.setValidators(Validators.required);
          } else {
            svcCtrl.clearValidators();
          }

          svcCtrl.updateValueAndValidity();
        });

      this.getShopAdmins(this.idShop);

      this.initialized = true;
    }
  }

  /* User list file upload BEGIN */

  fileUserPrepSendRequest(event) {
    let authToken = localStorage.getItem('auth_token');
    if (authToken !== undefined) event.xhr.setRequestHeader("Authorization", authToken);

  }

  fileUserUploaded(event) {
    console.log('fileUserUploaded called.');
    const excludes = !this.voucherUsageList ? [] : this.voucherUsageList.map(vu => vu.id);

    let result = JSON.parse(event.xhr.response);

    this.voucherDistResult = result.response;

    this.getUsers(this.voucher.idShop, this.voucher.id);

    this.saved.emit(this.voucher);

    this.voucherService.sendNotification(this.idShop, this.voucher.id, excludes).subscribe(
      () => {
        this.msgs.push({ severity: 'info', summary: 'File upload success', detail: '' });
      },
      err => console.error(err)
    );
  }

  fileUserUploadError(event) {
    this.msgs.push({ severity: 'error', summary: 'File upload error', detail: '' });
  }

  fileUserUploadSelect(event) {
    this.voucherDistResult = [];
  }

  /* User list file upload END */


  doCancel(target: Voucher) {
    UtilsService.copyInto(this.voucherCopy, target);
    this.validityDateModel.momentObj = new moment(target.validityDate);
    this.validityDateModel.formatted = this.validityDateModel.momentObj.format("DD/MM/YYYY");
    this.userformVoucher.markAsPristine();
  }

  onCancel() {
    /*
    UtilsService.copyInto(this.voucherCopy, this.voucher);
    this.validityDateModel.momentObj = new moment(this.voucher.validityDate);
    this.validityDateModel.formatted = this.validityDateModel.momentObj.format("DD/MM/YYYY");
    this.userformVoucher.markAsPristine();
    */
    this.doCancel(this.voucher);
  }

  getUsers(idShop: string, idVoucher: string): void {
    this.voucherService.getUsers(idShop, idVoucher).subscribe(
      usages => {
        this.distributeToAllDisabled = false;
        this.voucherUsageList = usages || [];
        this.enableFormControls(this.voucherUsageList.length == 0);
        this.voucher.nbBeneficiaries = this.voucherUsageList.length;

      },
      error => this.msgs.push({ severity: 'error', summary: 'User List', detail: error })
    );
  }

  getShopAdmins(idShop: string) {
    let query: ShopAdminServiceQuery = new ShopAdminServiceQuery('', 0, 50, "lName", 1, false, true);

    this.shopAdminService.getShopAdmins(idShop, query)
      .subscribe(result => {
        this.shopAdmins = result.shopAdmins;


      },
        error => this.msgs.push({ severity: 'error', summary: 'Shop Admins', detail: error })
      );
  }

  onInitiatorChange(idShopAdmin: string) {
    let seletectedShopAdmin = this.shopAdmins.find(element => element.id === idShopAdmin);
    this.voucher.fullnameInitiator = seletectedShopAdmin.fName + " " + seletectedShopAdmin.lName;
  }

  onDelete() {
    if (this.voucher !== null && this.voucher.id !== null)
      this.voucherService.deleteVoucher(this.voucher).subscribe(
        response => {
          if (response === "ok") {
            this.deleted.emit(this.voucher);
            this.voucher = null;
          }
        },

        error => this.msgs.push({ severity: 'error', summary: 'Deleting Voucher', detail: error })
      );
  }

  saveVoucher() {
    this.voucher.validityDate = this.validityDateModel.momentObj.valueOf();
    this.voucher.useVoucherCode = this.userformVoucher.get('useVoucherCode').value;
    this.voucher.useSingleVoucherCode = this.userformVoucher.get('useSingleVoucherCode').value;
    this.voucher.singleVoucherCode = this.userformVoucher.get('singleVoucherCode').value || null;

    this.voucherService.createOrUpdateVoucher(this.voucher)
      .subscribe(

        id => {
          this.voucher.id = id;
          this.fetchCodes(id);

          this.userformVoucher.markAsPristine();
          this.saved.emit(this.voucher);
          UtilsService.copyInto(this.voucher, this.voucherCopy);
          if (this.myFileUpload) this.myFileUpload.url = environment.restServer + "/admin/shops/" + this.voucher.idShop + "/vouchers/" + this.voucher.id + "/uploadUserFile";
          if (this.voucherFileUpload) {
            this.voucherFileUpload.url = environment.voucherCodeUploadEndpoint
              .replace(':shopId', this.voucher.idShop)
              .replace(':voucherId', this.voucher.id);
          }
          this.msgs.push({ severity: 'info', summary: 'Saving Voucher', detail: 'OK' });
        },

        error => this.msgs.push({ severity: 'error', summary: 'Saving Voucher', detail: error })
      );


  }

  ngOnChanges(changes: SimpleChanges) {
    this.ngOnInit();
    this.codes = [] as VoucherCode[]
    this.voucherDistResult = [];

    this.myFileUpload.clear();
    if (this.myFileUpload) {
    }
    if (this.voucherFileUpload) {
      this.voucherFileUpload.clear();
    }

    if (changes['voucher'] != undefined) {

      if (!this.userformVoucher.pristine) {
        this.doCancel(changes['voucher'].previousValue);
      }

      let changedVoucher: Voucher = changes['voucher'].currentValue;
      this.userformVoucher.get('useVoucherCode').reset(changedVoucher.useVoucherCode, { emitEvent: true });
      this.userformVoucher.get('useSingleVoucherCode').reset(changedVoucher.useSingleVoucherCode, { emitEvent: true });
      this.userformVoucher.get('singleVoucherCode').reset(changedVoucher.singleVoucherCode, { emitEvent: true });
      if (changedVoucher != undefined) {
        if (changedVoucher.id != null) {
          UtilsService.copyInto(this.voucher, this.voucherCopy);

          if (this.myFileUpload) this.myFileUpload.url = environment.restServer + "/admin/shops/" + this.voucher.idShop + "/vouchers/" + this.voucher.id + "/uploadUserFile";
          if (this.voucherFileUpload) {
            this.voucherFileUpload.url = environment.voucherCodeUploadEndpoint
              .replace(':shopId', this.voucher.idShop)
              .replace(':voucherId', this.voucher.id);
          }

          this.validityDateModel.momentObj = new moment(this.voucher.validityDate);
          this.validityDateModel.formatted = this.validityDateModel.momentObj.format("DD/MM/YYYY");

          this.getUsers(this.voucher.idShop, this.voucher.id);

          if (this.shopAdmins && this.voucher) {
            this.initiatorisAdmin = this.shopAdmins.filter(sa => {
              sa.id === this.voucher.idInitiator;
            }).length > 0;
          }

          this.fetchCodes(changedVoucher.id);
        } else {
          /*
          this.validityDateModel.momentObj = new moment();
          this.validityDateModel.formatted = this.validityDateModel.momentObj.format("DD/MM/YYYY");
          */

          this.validityDateModel.momentObj = null;
          this.validityDateModel.formatted = "";

          this.voucherUsageList = [];
          this.enableFormControls(true);
        }

      }
    }

  }

  selectVoucherCode(event: any) {
    console.log('selectVoucherCode', event);
  }

  voucherCodeUploadError(event: any) {
    console.log('voucherCodeUploadError', event);
  }

  voucherCodeFileUpload(event: any) {
    this.fetchCodes(this.voucher.id);
  }

  voucherCodeBeforeSend(event: any) {
    console.log('voucherCodeBeforeSend', event);
  }

  ngOnDestroy(): void {
    if (this.useVoucherCodeSub) {
      this.useVoucherCodeSub.unsubscribe();
    }
    if (this.useSingleVoucherCodeSub) {
      this.useSingleVoucherCodeSub.unsubscribe();
    }
  }

  addQuantity() {
    if (this.quantityForm.valid) {
      const qty = this.quantityForm.get('quantity').value;
      this.voucherService.addSingleCodeVoucherQuantity(this.idShop, this.voucher.id, qty).subscribe(() => {
        this.msgs.push({ severity: 'info', summary: 'Voucher', detail: 'Voucher Quantity available updated' });
        this.fetchCodes(this.voucher.id)
      }, err => {
        console.error(err);
        // TODO notify user about error
      });
    }
  }

  distributeToAll(event:MouseEvent, voucher: Voucher): void {
    if (confirm('Are you sure?')) {
      this.distributeToAllDisabled = true;
      this.voucherService.distributeToAll(voucher.id)
        .subscribe((_) => {
          this.getUsers(voucher.idShop, voucher.id)
          console.log('distribute to all voucher', voucher.id)
        }, (err) => {
          console.error(err);
          this.distributeToAllDisabled = false;
        })
    }
  }

  private fetchCodes(voucherId: string) {
    this.showVoucherCodeListSpinner = true;
    this.codes$ = this.voucherService.getCodes(this.voucher.idShop, voucherId).pipe(
      tap(codes => {
        this.showVoucherCodeListSpinner = false;
        this.codes = codes as VoucherCode[]
      }),
      catchError((err, caught) => {
        this.showVoucherCodeListSpinner = false;
        console.error(err);

        return caught;
      }),
    );
  }
}
