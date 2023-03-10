import { Component, OnInit, EventEmitter, Input, Output, OnChanges, SimpleChanges, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';

import { UploadService } from '../service/upload.service'
import { Validators, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { ItemService } from '../service/item.service';
import { Item } from '../pojo/item';
import { User } from '../pojo/user';
import { Coupon } from '../pojo/coupon';
import { CouponService } from '../service/coupon.service';
import { InputSwitchModule } from 'primeng/primeng';
import { UtilsService } from '../service/utils.service'
import { environment } from '../../environments/environment';
import { DatePickerOptions, DateModel } from 'ng2-datepicker';



import { FileUploadModule, FileUpload } from 'primeng/primeng';

import * as moment_ from 'moment';
const moment: any = (<any>moment_).default || moment_;


@Component({
  //moduleId: module.id,
  selector: 'app-coupon-detail',
  templateUrl: 'coupon-detail.component.html',
  styleUrls: ['coupon-detail.component.css'],
  providers: [CouponService, UploadService, ItemService],
})
export class CouponDetailComponent implements OnInit {
  @Input() coupon: Coupon;
  @Input() couponList: Coupon[];
  @Input() idShop: string;
  @Input() refreshMe: boolean;
  @Output() deleted: EventEmitter<any> = new EventEmitter();
  // @ViewChild(FileUpload) myFileUpload : FileUpload;
  //@ViewChildren('aFileUpload') fileUploads: QueryList<FileUpload>;

  @ViewChild('aFileUpload') set content(content: FileUpload) {
    this.myFileUpload = content;
  }

  myFileUpload: FileUpload;

  userformCoupon: FormGroup;

  msgs: Message[] = [];

  filesToUpload: File[] = [];

  items: Item[];

  // availableItems: Item[] = [];

  couponCopy: Coupon = new Coupon();

  couponDistResult: any;
  role: string;

  //theDate : string;

  userList: User[] = [];

  validityDateOptions: DatePickerOptions;
  validityDateModel: DateModel;

  initialized: boolean = false;

  constructor(
    private couponService: CouponService,
    private uploadService: UploadService,
    private itemService: ItemService
  ) { }

  fileUserPrepSendRequest(event) {
    let authToken = localStorage.getItem('auth_token');
    if (authToken !== undefined) event.xhr.setRequestHeader("Authorization", authToken);

  }

  fileUserUploaded(event) {

    let result = JSON.parse(event.xhr.response);

    this.couponDistResult = result.response;

    this.getUsers(this.coupon);

    /*
        for (var i = 0; i < result.response.length; i++) {
          let dist = result.response[i];
          this.couponDistributionResult += dist.file + " : " + dist.distributed + " coupons distributed " ;//+ "&013; / &#13;";
        }
        */


    this.msgs.push({ severity: 'info', summary: 'File upload success', detail: '' });
  }

  fileUserUploadError(event) {
    this.msgs.push({ severity: 'error', summary: 'File upload error', detail: '' });
  }

  fileUserUploadSelect(event) {
    this.couponDistResult = [];
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

    if (!this.initialized) {

      this.role = localStorage.getItem('auth_role');

      this.getItems(this.idShop);

      this.userformCoupon = new FormGroup({
        couponName: new FormControl('', Validators.required),
        discountValue: new FormControl('', Validators.compose([Validators.required, Validators.pattern("[-+]?([0-9]*\.[0-9]+|[0-9]+)")])),
        priceItem: new FormControl('', null),
        newPrice: new FormControl('', null),
        itemName: new FormControl('', Validators.required),
        validityDate: new FormControl('', Validators.required),
        uploadFile: new FormControl('', null)

      });

      this.validityDateModel = new DateModel();
      this.validityDateOptions = new DatePickerOptions();
      this.validityDateOptions.format = "DD/MM/YYYY";

      this.initialized = true;
    }


  }

  static maxValue(maxValue: number): ValidatorFn {
    return (control: FormControl): { [key: string]: any } => {

      var v: number = control.value;
      return v > maxValue ?
        { "minlengmaxValue": { "required": maxValue, "actualLength": v } } :
        null;
    };
  }

  /*
    calcAvailableItems() {
      if (this.coupon != undefined) {
  
        let tmp: Item[] = this.items.slice();
  
        
        let xitem: Item;
  
        if (this.couponList != undefined) {
          for (let i = 0; i < this.couponList.length; i++) {
            xitem = tmp.find(elem => elem.id === this.couponList[i].idItem);
            if (xitem != null && this.coupon !=null && xitem.id != this.coupon.idItem) {
              // remove item from list
              let indx = tmp.findIndex(ex => ex.id === xitem.id);
              tmp.splice(indx, 1);
            }
          }
        }
        
        this.availableItems = tmp;
  
  
      }
    }
    */

  ngOnChanges(changes: SimpleChanges) {

    this.ngOnInit();

    if (this.myFileUpload) {
      this.myFileUpload.clear();
    }

    this.couponDistResult = [];

/*
    if (this.validityDateModel == null) {
      this.validityDateModel = new DateModel();
      this.validityDateOptions = new DatePickerOptions();
      this.validityDateOptions.format = "DD/MM/YYYY";
    }
    */

    if (changes['coupon'] != undefined) {

      if (!this.userformCoupon.pristine) {
        this.doCancel(changes['coupon'].previousValue);
      }

      let changedItem = changes['coupon'].currentValue;

      if (changedItem != undefined && changedItem.id != null) {

        UtilsService.copyInto(this.coupon, this.couponCopy);

        if (this.myFileUpload) this.myFileUpload.url = environment.restServer + "/admin/coupons/" + this.coupon.id + "/uploadUserFile";

        this.validityDateModel.momentObj = new moment(this.coupon.validityDate);
        this.validityDateModel.formatted = this.validityDateModel.momentObj.format("DD/MM/YYYY");

        // }
        if (this.userformCoupon) {
          this.userformCoupon.get('discountValue').setValidators(Validators.compose([Validators.required, Validators.pattern("[-+]?([0-9]*\.[0-9]+|[0-9]+)"), CouponDetailComponent.maxValue(this.coupon.priceItem)]));
          this.userformCoupon.get('discountValue').setErrors(null);
          this.userformCoupon.updateValueAndValidity();
        }

      } else {
        this.userList = [];

        if (this.coupon) {
          /*
          this.validityDateModel.momentObj = new moment();
          this.validityDateModel.formatted = this.validityDateModel.momentObj.format("DD/MM/YYYY");
          */
          this.validityDateModel.momentObj = null;
          this.validityDateModel.formatted = "";
          this.coupon.priceItem = 0;
          this.coupon.discountValue = 0;
          this.coupon.idShop = this.idShop;
        }
      }

      //if (this.items != undefined && this.items != null) this.calcAvailableItems()
    }

    if (changes['refreshMe'] != undefined) {
      let changedItem = changes['refreshMe'].currentValue;
      if (changedItem != undefined && changedItem != null) {
        this.getItems(this.idShop);
      }
    }
    if (this.coupon != undefined) this.getUsers(this.coupon);
  }


  enableControls(enable: boolean): void {
    if (enable) {
      this.userformCoupon.get('couponName').enable();
      this.userformCoupon.get('discountValue').enable();
      this.userformCoupon.get('itemName').enable();
      this.userformCoupon.get('uploadFile').enable();
      // this.renderer.invokeElementMethod(this.validityDateElement.nativeElement, 'removeAttribute', ['readonly']);


    } else {
      this.userformCoupon.get('couponName').disable();
      this.userformCoupon.get('discountValue').disable();
      this.userformCoupon.get('itemName').disable();
      this.userformCoupon.get('uploadFile').disable();

      // this.renderer.invokeElementMethod(this.validityDateElement.nativeElement, 'setAttribute', ['readonly', true]);
    }
  }

  getUsers(coupon: Coupon): void {
    if (coupon === null || coupon.id === null) {
      this.userList = [];
      this.enableControls(true);
    }
    else {
      this.couponService.getCouponUsers(coupon).subscribe(
        users => {
          this.userList = users;
          this.enableControls(users.length == 0);
        },
        error => this.msgs.push({ severity: 'error', summary: 'Item List', detail: error })
      );
    }
  }

  onItemChange(idItem: string) {

    let seletectedItem = this.items.find(element => element.id === idItem);

    if (seletectedItem != null) {
      this.coupon.priceItem = seletectedItem.price;
      this.coupon.nameItem = seletectedItem.name;
      this.coupon.priceItem = seletectedItem.price;
      this.coupon.discountValue = 0;

      this.userformCoupon.get('discountValue').setValidators(Validators.compose([Validators.required, Validators.pattern("[-+]?([0-9]*\.[0-9]+|[0-9]+)"), CouponDetailComponent.maxValue(this.coupon.priceItem)]));
      this.userformCoupon.get('discountValue').setErrors(null);
      this.userformCoupon.updateValueAndValidity();

    }

    this.userformCoupon.markAsDirty();

  }


   doCancel (target : Coupon) {
    UtilsService.copyInto(this.couponCopy, target);
    this.validityDateModel.momentObj = new moment(target.validityDate);
    this.validityDateModel.formatted = this.validityDateModel.momentObj.format("DD/MM/YYYY");
    this.userformCoupon.markAsPristine();
  }


  onCancel() {
    /*
    UtilsService.copyInto(this.couponCopy, this.coupon);
    this.validityDateModel.momentObj = new moment(this.coupon.validityDate);
    this.validityDateModel.formatted = this.validityDateModel.momentObj.format("DD/MM/YYYY");
    this.userformCoupon.markAsPristine();
    */
    this.doCancel(this.coupon);
  }

  removePhoto(path) {
    this.coupon.photoPath = '';
  }

  getPhotoFolder(path) {
    return environment.restServer + "/files/shops/" + this.idShop + "/" + path;
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  upload() {
    let urlUpload = environment.restServer + "/admin/shops/" + this.idShop + "/" + "uploadFile";

    this.uploadService.getObserver().subscribe((result) => console.log("Observe : " + result));

    this.uploadService.makeFileRequest(urlUpload, this.filesToUpload).subscribe((result) => {

      this.coupon.photoPath = result;

      this.userformCoupon.markAsDirty();

      this.filesToUpload = [];
      (<HTMLInputElement>document.getElementById("fileUploadCoupon")).value = '';
    }, (error) => {
      console.error(error);
    });
  }

  canUpload() {
    return this.filesToUpload.length > 0;
  }

  onSubmit() {
    this.msgs = [];

    let newItem = (this.coupon.id === null);

    this.coupon.validityDate = this.validityDateModel.momentObj.valueOf();
    

    this.couponService.createOrUpdateCoupon(this.idShop, this.coupon)
      .subscribe(

      id => {
        this.coupon.id = id;
        if (newItem) this.couponList.push(this.coupon);
        this.msgs.push({ severity: 'info', summary: 'Saving Coupon', detail: 'OK' });
        if (this.myFileUpload) this.myFileUpload.url = environment.restServer + "/admin/coupons/" + this.coupon.id + "/uploadUserFile";
        this.userformCoupon.markAsPristine();
      },

      // result => this.formMsgs.push({severity:'info', summary:'Success', detail:'Form Submitted ' + result}),
      error => this.msgs.push({ severity: 'error', summary: 'Saving Coupon', detail: error })
      );
  }

  onDelete() {
    if (this.coupon !== null && this.coupon.id !== null)
      this.couponService.deleteCoupon(this.coupon).subscribe(
        response => {
          if (response === "ok") {
            if (this.coupon) {
              let indx = this.couponList.findIndex(anItem => anItem === this.coupon);
              this.couponList.splice(indx, 1);
              this.deleted.emit(this.coupon);
            }

            this.coupon = null;
          }
        },

        // result => this.formMsgs.push({severity:'info', summary:'Success', detail:'Form Submitted ' + result}),
        error => this.msgs.push({ severity: 'error', summary: 'Deleting coupon', detail: error })
      );
  }
}
