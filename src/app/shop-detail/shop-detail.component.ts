import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ShopService } from '../service/shop.service';
import { ShopTypeService } from '../service/shopType.service';
import { MainCategoryService } from '../service/main-category.service';
import { AuthService } from '../service/auth.service';
import { ShopAdminService, ShopAdminServiceQuery } from '../service/shopadmin.service';
import { Shop } from '../pojo/shop';
import { ShopJoin } from '../pojo/shop_join';
import { Person } from '../pojo/person';
import { ShopAdmin } from '../pojo/shopadmin';
import { ShopType } from '../pojo/shopType';
import { MainCategory } from '../pojo/mainCategory';
import { Status } from '../pojo/status';
import { StatusDiscount } from '../pojo/statusdiscount';
import { Pos } from '../pojo/pos';

import { UploadService } from '../service/upload.service';
import { environment } from '../../environments/environment';
import { Message } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MessagesModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { MaxValueValidator } from '../utils/maxvalue.directive';
import { UtilsService } from '../service/utils.service';
import { SaleVoucherShopService } from '../service/sale-voucher-shop.service';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators'
import { ShopExtService } from '../service/shop-ext.service';
import { of } from 'rxjs/observable/of';
import { PosService } from '../service/pos.service';


declare var google: any;

@Component({
  selector: 'app-shop-detail',
  templateUrl: 'shop-detail.component.html',
  styleUrls: ['shop-detail.component.css'],
  providers: [PosService, ShopAdminService, ShopService, ShopTypeService, UploadService, UtilsService, MainCategoryService],
})
export class ShopDetailComponent implements OnInit {

  @Input()
  idShop: string;

  shop: Shop;

  options: {[key: string]: boolean } = {};

  shopCopy: Shop = new Shop();

  shopTypes: ShopType[];

  mainCategories: MainCategory[] = [];

  audiences: String[] = ['ALL', 'HOMME', 'FEMME', 'ENFANT'];

  status: String[] = ['ACTIVE', 'INACTIVE', 'PENDING'];

  msgs: Message[] = [];

  userform: FormGroup;

  saleVoucherForm: FormGroup;

  shopExtForm: FormGroup;

  submitted: boolean;

  filesToUpload: File[] = [];

  refreshFlashsells = true;

  refreshCoupons = true;

  shopOwnerFullname: string = "";

  shopAdmins: ShopAdmin[] = [];

  shopAdminsCopy: ShopAdmin[] = [];

  isAdmin: boolean;

  sub: any;

  saleVoucherShop: SaleVoucherShop;

  shopExt: ShopExt;
  loyaltyShops: Shop[];
  logisticProvidersShops: Shop[] = [];
  canEcommerce = false;
  ecommercePlan = ['ENTERPRISE', 'PREMIUM', 'DISTRIBUTOR'];

  constructor(
    private authService: AuthService,
    private utilsService: UtilsService,
    private shopService: ShopService,
    private shopTypeService: ShopTypeService,
    private mainCategoryService: MainCategoryService,
    private uploadService: UploadService,
    private shopAdminService: ShopAdminService,
    private route: ActivatedRoute,
    private saleVoucherShopService: SaleVoucherShopService,
    private shopExtService: ShopExtService,
    private posService: PosService,
    private router: Router) {
    this.shopExtForm = new FormGroup({
      adult: new FormControl('', Validators.required),
      brn: new FormControl(''),
      vatNumber: new FormControl(''),
      tradeName: new FormControl(''),
      plan: new FormControl('', Validators.required),
      hasLoyalty: new FormControl(''),
      currencyAmount: new FormControl(''),
      pointAmount: new FormControl(''),
      loyaltyShopId: new FormControl(''),
      onlineCatalogButton: new FormControl(''),
      catalogButton: new FormControl(''),
      buyNowButton: new FormControl(''),
      isFeatured: new FormControl(''),
      mainCategories: new FormGroup({}),
      tabs: new FormArray(
        [
          new FormGroup({
            label: new FormControl(''),
            content: new FormControl(''),
          }),
          new FormGroup({
            label: new FormControl(''),
            content: new FormControl(''),
          }),
          new FormGroup({
            label: new FormControl(''),
            content: new FormControl(''),
          }),
        ]
      ),
    });

    this.shopExtForm.get('plan').valueChanges.subscribe(val => {
      this.canEcommerce = this.ecommercePlan.indexOf(val) !== -1;
    });
  }

  get tabs(): FormArray {
    return this.shopExtForm.get('tabs') as FormArray;
  }

  ngOnInit(): void {
    this.shopAdmins = [];
    this.isAdmin = this.authService.isAdmin();
    this.shopService.getLogisticProviderShops().subscribe(shs => this.logisticProvidersShops = shs);
    this.shopExt = this.shopExtService.create();


    if (!this.idShop) {
      this.sub = this.route.params.subscribe(params => {
        this.idShop = params['id'];
      });
    }

    if (this.idShop === "*") {
      // New Shop
      this.shop = new Shop();
      this.saleVoucherShop = {
        id: { stringValue: '' },
        enabled: { booleanValue: false },
      };

      this.shop.state = 'PENDING';
      this.shop.audience = "ALL";
      this.shopExtForm.get('onlineCatalogButton').reset(false);
      this.shopExtForm.get('buyNowButton').reset(false);
      this.shopExtForm.get('catalogButton').reset(false);
      this.shopExtForm.get('isFeatured').reset(false);
      UtilsService.copyInto(this.shop, this.shopCopy);

      this.shopTypeService.getShopTypes()
        .subscribe(shopTypes => { this.shopTypes = shopTypes; },
          error => this.msgs.push({ severity: 'error', summary: 'Shop Admins', detail: error })
        );
        this.mainCategoryService.fetchAll().subscribe(
          (list) => {
            this.mainCategories = list;
            const checkboxes = <FormGroup>this.shopExtForm.get('mainCategories')
            list.forEach((mc) => checkboxes.addControl(mc.id,   new FormControl(false)));
          },
          (error) => this.msgs.push({ severity: 'error', summary: 'Shop Admins', detail: error })
        );
    } else {
      // Existing Shop
      this.saleVoucherShopService.find(this.idShop)
        .subscribe(svs => this.saleVoucherShop = svs,
          error => this.msgs.push({ severity: 'error', summary: 'Shop Admins', detail: error }));


      this.shopExtService.find(this.idShop)
        .subscribe(se => {
          this.shopExtForm.get('plan').reset(se.plan.stringValue);
          this.shopExtForm.get('onlineCatalogButton').reset(se.onlineCatalogButton ? se.onlineCatalogButton.booleanValue : false)
          this.shopExtForm.get('buyNowButton').reset(se.buyNowButton ? se.buyNowButton.booleanValue : false)
          this.shopExtForm.get('catalogButton').reset(se.catalogButton ? se.catalogButton.booleanValue : false)
          this.shopExtForm.get('isFeatured').reset(se.isFeatured ? se.isFeatured.booleanValue : false)
          this.shopExt = se as ShopExt;

          if (this.shopExt.tabs) {
            for (let i in this.shopExt.tabs.arrayValue.values) {
              const val = this.shopExt.tabs.arrayValue.values[i];
              this.tabs.get(i).get('label')
                .reset(val.mapValue.fields.label.stringValue);
              this.tabs.get(i).get('content')
                .reset(val.mapValue.fields.content.stringValue);
            }
          }

          this.mainCategoryService.fetchAll().subscribe(
            (list) => {
              this.mainCategories = list;
              const checkboxes = <FormGroup>this.shopExtForm.get('mainCategories')
              list.forEach((mc) => {
                let value = false;
                const categories = se.mainCategories;
                if (categories) {
                  const fields = categories.mapValue.fields
                  if (fields) {
                    const fv = fields[mc.id];
                    if (fv) {
                      value = fv.booleanValue || false;
                    }
                  }
                }
                checkboxes.addControl(mc.id,   new FormControl(value));
              });
            },
            (error) => this.msgs.push({ severity: 'error', summary: 'Shop Admins', detail: error })
          );
        });
      // this.shopExtService.find(this.idShop)
      //   .subscribe(sext => this.shopExt = sext,
      //     error => this.msgs.push({ severity: 'error', summary: 'Shop Admins', detail: error }));

      this.shopService.getLoyaltyShops()
        .subscribe(shops => {
          this.loyaltyShops = shops;
        });

      this.shopService.getShop(this.idShop)
        .subscribe(
          shop => {
            this.shop = shop;

            let query: ShopAdminServiceQuery = new ShopAdminServiceQuery('', 0, 50, "lName", 1, false, false);

            this.shopAdminService.getShopAdmins(this.shop.id, query)
              .subscribe(result => {
                this.shopAdmins = result.shopAdmins;
                this.shopAdminsCopy = this.shopAdmins.slice();
                this.shopOwnerFullname = "";
                if (this.shopAdmins != undefined) this.shopAdmins.forEach((shopAdmin) => {
                  this.shopOwnerFullname += shopAdmin.fName + " " + shopAdmin.lName + " ";
                })

              },
                error => this.msgs.push({ severity: 'error', summary: 'Shop Admins', detail: error })
              );

            this.shopTypeService.getShopTypes()
              .subscribe(shopTypes => {
                this.shopTypes = shopTypes;
                if (this.shop.shopType) {
                  let shopType = this.shopTypes.find((a) => { return (a.id === this.shop.shopType.id) });
                  this.shop.shopType = shopType;
                  this.shopCopy.shopType = this.shop.shopType;
                }
              },
                error => this.msgs.push({ severity: 'error', summary: 'Shop Types', detail: error })
              );
            this.makeCopy();
          },
          error => this.msgs.push({ severity: 'error', summary: 'Shop Detail', detail: error })
        );
    }

    this.userform = new FormGroup({
      website: new FormControl('', null),
      name: new FormControl('', Validators.required),
      shopType: new FormControl('', Validators.required),
      mainCategory: new FormControl('', Validators.required),
      audience: new FormControl('', Validators.required),
      status: new FormControl({ value: '', disabled: !this.isAdmin }, Validators.required),
      description: new FormControl('', Validators.required),
      silver: new FormControl({ value: '', disabled: !this.isAdmin }, Validators.compose([Validators.required])),
      gold: new FormControl({ value: '', disabled: !this.isAdmin }, Validators.required),
      premium: new FormControl({ value: '', disabled: !this.isAdmin }, Validators.required),
    });

    this.saleVoucherForm = new FormGroup({
      enabled: new FormControl('', Validators.required),
    });


  }

  makeCopy() {
    UtilsService.copyInto(this.shop, this.shopCopy);
    this.shopCopy.statusDiscount = new StatusDiscount();
    UtilsService.copyInto(this.shop.statusDiscount, this.shopCopy.statusDiscount);
    if (this.shop.photoPath != null) this.shopCopy.photoPath = this.shop.photoPath.slice();
  }



  removePhoto(path) {
    this.shop.photoPath = this.shop.photoPath.filter(aPath => aPath !== path);
    this.userform.markAsDirty();
  }

  getPhotoFolder(path) {
    return environment.restServer + "/files/shops/" + this.shop.id + "/" + path;
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  upload() {
    let urlUpload = environment.restServer + "/admin/shops/" + this.shop.id + "/" + "uploadFile";

    this.uploadService.getObserver().subscribe((result) => console.log("Observe : " + result));

    this.uploadService.makeFileRequest(urlUpload, this.filesToUpload).subscribe((result) => {

      if (this.shop.photoPath != null)
        this.shop.photoPath.push(result);
      else
        this.shop.photoPath = [result];

      this.filesToUpload = [];
      this.userform.markAsDirty();
      (<HTMLInputElement>document.getElementById("fileUpload")).value = '';
    }, (error) => {
      console.error(error);
    });
  }

  getLogisticProviderMapEntry(lp: Shop): FirestoreBoolean {
    if (!this.shopExt.logisticProviders || !this.shopExt.logisticProviders.mapValue || !this.shopExt.logisticProviders.mapValue.fields) {
      this.shopExt.logisticProviders = {
        mapValue: {
          fields: {}
        }
      }
    }


    if (!this.shopExt.logisticProviders.mapValue.fields[lp.id]) {
      this.shopExt.logisticProviders.mapValue.fields[lp.id] = {
        booleanValue: false,
      }
    }

    return this.shopExt.logisticProviders.mapValue.fields[lp.id];
  }

  canUpload() {
    return this.filesToUpload.length > 0;
  }

  onSubmit() {
    this.msgs = [];
    this.shop.statusDiscount.SILVER = +this.shop.statusDiscount.SILVER;
    this.shop.statusDiscount.GOLD = +this.shop.statusDiscount.GOLD;
    this.shop.statusDiscount.PREMIUM = +this.shop.statusDiscount.PREMIUM;
    this.shopExt.plan = { stringValue: this.shopExtForm.get('plan').value };
    this.shopExt.onlineCatalogButton = { booleanValue: this.shopExtForm.get('onlineCatalogButton').value || false }
    this.shopExt.catalogButton = { booleanValue: this.shopExtForm.get('catalogButton').value || false }
    this.shopExt.buyNowButton = { booleanValue: this.shopExtForm.get('buyNowButton').value || false }
    this.shopExt.isFeatured = { booleanValue: this.shopExtForm.get('isFeatured').value || false }
    const mainCategoriesFirebase = {};
    const mainCategoriesValues = this.shopExtForm.get('mainCategories').value;
    for (const key in mainCategoriesValues) {
      mainCategoriesFirebase[key] = { booleanValue: mainCategoriesValues[key] };
    }
    this.shopExt.mainCategories = {
      mapValue: { fields: mainCategoriesFirebase },
    };

    this.shopExt.tabs = formDataToTabs(this.tabs);


    // this.saleVoucherShopService.save(this.saleVoucherShop)
    // .subscribe(() => {
    this.shopService.createOrUpdateShop(this.shop)
      .catch((err) => {
        if (!environment.production && this.shop.id) {
          return of(this.shop.id);
        }

        return Observable.throw(err);
      })
      .subscribe(
        (id: string) => {
          let newShop = (this.shop.id === null);
          this.shop.id = id;
          this.shopExt.id.stringValue = id;

          // update the manager list

          this.shopAdminService.updateShopAdminShop(this.shop.id, this.shopAdmins)
            .subscribe(
              id => {
                localStorage.setItem('shop_name', this.shop.name);
                this.userform.markAsPristine();
              },
              error => this.msgs.push({ severity: 'error', summary: 'Saving Shop', detail: error })
            );

          this.saleVoucherShop.id.stringValue = id;
          this.saleVoucherShopService.save(this.saleVoucherShop).subscribe(
            svs => this.msgs.push({ severity: 'info', summary: 'Saving Shop Voucher', detail: 'OK' }),
            err => this.msgs.push({ severity: 'error', summary: 'Saving Shop Voucher', detail: err }));
          this.shopExtService.save(this.shopExt).subscribe(
            svs => this.msgs.push({ severity: 'info', summary: 'Saving Shop Extension', detail: 'OK' }),
            err => {
              console.error(err);
              this.msgs.push({ severity: 'error', summary: 'Saving Shop Extension', detail: err });
            });

            console.log('this.userform.value', this.userform.value);
            this.posService.getPosList(id).switchMap((posList) => {
              return this.shopService.saveJoin(this.buildShopJoin(
               Object.assign({}, this.shop, this.userform.value), this.getShopExtData(), posList));
            })
            .subscribe(
              shopJoin => this.msgs.push({ severity: 'info', summary: 'Saving Shop Visit mauritius', detail: 'OK' }),
                err => this.msgs.push({ severity: 'error', summary: 'Saving Shop Visit mauritius', detail: err }));

              this.msgs.push({ severity: 'info', summary: 'Saving Shop', detail: 'OK' });

        },
        error => this.msgs.push({ severity: 'error', summary: 'Saving Shop', detail: error })
      );
      // }, err => this.msgs.push({ severity: 'error', summary: 'Saving Sale Voucher', detail: err }))
  }

  getShopExtData(): ShopExtData {
    return {
      id: this.shopExt.id.stringValue,
      adult: this.shopExt.adult.booleanValue,
      brn: this.shopExt.brn.stringValue,
      vatNumber: this.shopExt.vatNumber.stringValue,
      tradeName: this.shopExt.tradeName.stringValue,
      plan: this.shopExt.plan.stringValue,
      hasLoyalty: this.shopExt.hasLoyalty.booleanValue,
      currencyAmount: this.toNumber(this.shopExt.currencyAmount.integerValue),
      pointAmount: this.toNumber(this.shopExt.pointAmount.integerValue),
      loyaltyShopId: this.shopExt.loyaltyShopId.stringValue,
      logisticProviders: this.getMapData(this.shopExt.logisticProviders.mapValue.fields),
      freeShippingEnabled: this.shopExt.freeShippingEnabled.booleanValue,
      freeShippingThreshold: this.toNumber(this.shopExt.freeShippingThreshold.integerValue),
      handlingFeeEnabled: this.shopExt.handlingFeeEnabled.booleanValue,
      handlingFeeAmount: this.toNumber(this.shopExt.handlingFeeAmount.integerValue),
      noHandlingFeeEnabled: this.shopExt.noHandlingFeeEnabled.booleanValue,
      noHandlingFeeThreshold: this.toNumber(this.shopExt.noHandlingFeeThreshold.integerValue),
      onlineCatalogButton: this.shopExt.onlineCatalogButton.booleanValue,
      catalogButton: this.shopExt.catalogButton.booleanValue,
      buyNowButton: this.shopExt.buyNowButton.booleanValue,
      isFeatured: this.shopExt.isFeatured.booleanValue,
      mainCategories: this.getMapData(this.shopExt.mainCategories.mapValue.fields)
    };
  }

  toNumber(value: any): number {
    return Number(value);
  }

  getMapData(fields: { [key: string]: FirestoreBoolean }): {[key: string]: boolean} {
    const data: {[key: string]: boolean} = {};
    for (const key in fields) {
      data[key] = fields[key].booleanValue;
    }

    return data;
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  onGoBack() {
    window.history.back();
  }

  onCancel() {
    UtilsService.copyInto(this.shopCopy, this.shop);
    this.shop.shopType = this.shopCopy.shopType;
    this.shop.statusDiscount = new StatusDiscount();
    UtilsService.copyInto(this.shopCopy.statusDiscount, this.shop.statusDiscount);
    this.userform.markAsPristine();
    this.shopAdmins = this.shopAdminsCopy;
    this.shop.photoPath = this.shopCopy.photoPath;
  }

  onShopAdminsUpdated(): void {
    this.userform.markAsDirty();
  }

  isCancelDisabled() {
    return !this.shop.id || !this.userform.dirty || !this.saleVoucherForm.dirty;
  }

  isSaveDisabled() {
    !this.userform.valid || !this.userform.dirty;
  }

  numberToCurrency(val: number): number {
    if (!val) {
      return 0;
    }

    return Math.round(val * 100);
  }

  buildShopJoin(shop: Shop, shopExt: any, posList: Pos[]): ShopJoin {
    return Object.assign({posList}, shop, shopExt);
  }

  get isSport(): boolean {
    if (!this.shop || !this.shop.shopType) {
      return false;
    }

    return this.shop.shopType.id === '6246ac52263c7950c2a11001';
  }
}


function formDataToTabs(formArray: FormArray): Tabs {
  const tabs: Tabs = {
    arrayValue: {
      values: [],
    },
  }

  for (let i in formArray.controls) {
    const values: { label: string, content: string } = formArray.get(i).value;
    if (!values.label || !values.content) {
      continue;
    }

    tabs.arrayValue.values.push({ mapValue: { fields: {
      label: { stringValue: values.label },
      content: { stringValue: values.content },
    }}});
  }

  return tabs;
}
