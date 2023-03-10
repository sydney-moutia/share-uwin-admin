import { Component, enableProdMode, NgModule, ApplicationRef, Input } from '@angular/core';

import { XHRBackend, HttpModule } from '@angular/http';
import { Location, LocationStrategy, HashLocationStrategy } from '@angular/common';

import { environment } from '../environments/environment';

import { Validators, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { AppModule } from './app/app.module';

import { AppComponent } from './';

import { BrowserModule } from '@angular/platform-browser';

import { MaterialModule } from '@angular/material';
import * as xml2js from 'xml2js';

/*
import {MdListModule} from '@angular/material/list/list';
import {MdButtonModule} from '@angular/material/button/button';
import {MdCardModule} from '@angular/material/card/card';
import {MdIconModule} from '@angular/material/icon/icon';
import {MdToolbarModule} from '@angular/material/toolbar/toolbar';
import {MdSidenavModule} from '@angular/material/sidenav/sidenav';
import {MdInputModule} from '@angular/material/input/input-module';
import {MdCheckboxModule} from '@angular/material/checkbox/checkbox';
import {MdRippleModule} from '@angular/material/core/ripple/ripple';
import {PortalModule} from '@angular/material/core/portal/portal-directives';
import {OverlayModule} from '@angular/material/core/overlay/overlay-directives';
import {RtlModule} from '@angular/material/core/rtl/dir';
*/

import { DatePickerModule } from 'ng2-datepicker';
import { MomentModule } from 'angular2-moment';
import {
  DialogModule, SharedModule, PaginatorModule, GMapModule, Message, GrowlModule, MessagesModule, CheckboxModule,
  InputTextModule, DataTableModule, CarouselModule, TabViewModule, CalendarModule, FileUploadModule
} from 'primeng/primeng';


import { ShopListComponent } from './shop-list/shop-list.component';
import { PosListComponent } from './pos-list/pos-list.component';
import { ShopAdminListComponent } from './shopadmin-list/shopadmin-list.component';
import { ShopDetailComponent } from './shop-detail/shop-detail.component';
import { PosDetailComponent } from './pos-detail/pos-detail.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { FlashsellListComponent } from './flashsell-list/flashsell-list.component';
import { FlashsellDetailComponent } from './flashsell-detail/flashsell-detail.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { CouponListComponent } from './coupon-list/coupon-list.component';
import { CouponDetailComponent } from './coupon-detail/coupon-detail.component';
import { VoucherListComponent } from './voucher-list/voucher-list.component';
import { VoucherDetailComponent } from './voucher-detail/voucher-detail.component';
import { ShopAdminDetailComponent } from './shopadmin-detail/shopadmin-detail.component';
import { MenuComponent } from './menu/menu.component';
import { WShopAdminListComponent } from './widget/w-shopadmin-list';
import { ControlMessages } from './utils/control-messages.component';
import { LoginComponent } from './login/login.component';
import { ShopTypeListComponent } from './shoptype-list/shoptype-list.component';
import { ShopTypeDetailComponent } from './shoptype-detail/shoptype-detail.component';
import { routing } from './app.routing';
import { AuthService, LoggedInGuard } from './service/auth.service';
import { MaxValueValidator } from './utils/maxvalue.directive';
import { SurveyListComponent } from './survey-list/survey-list.component';
import { SurveyDetailComponent } from './survey-detail/survey-detail.component';
import { SaleVoucherShopService } from './service/sale-voucher-shop.service';
import { GiftVoucherListComponent } from './gift-voucher-list/gift-voucher-list.component';
import { GiftVoucherService } from './service/gift-voucher.service';
import { ShopExtService } from './service/shop-ext.service';
import { ProductExtService } from './service/product-ext.service';
import { ProductMainCategoryService } from './service/product-main-category.service';
import { PaymentOptionsDetailComponent } from './payment-options-detail/payment-options-detail.component';
import { ShopPaymentConfigService } from './service/shop-payment-config.service';
import { SalesOrderListComponent } from './sales-order-list/sales-order-list.component';
import { ShopSalesOrderService } from './service/shop-sales-order.service';
import { BannerEditComponent } from './banner-edit/banner-edit.component';
import { BannerService } from './service/banner.service';
import { LoyaltyPointsListComponent } from './loyalty-points-list/loyalty-points-list.component';
import { GoBackButtonComponent } from './shared/go-back-button/go-back-button.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { NotificationDetailComponent } from './notification-detail/notification-detail.component';
import { WelcomeVoucherListComponent } from './welcome-voucher-list/welcome-voucher-list.component';
import { ShopCategoryListComponent } from './shop-category-list/shop-category-list.component';
import { ShopCategoryNewComponent } from './shop-category-new/shop-category-new.component';
import { ShopCategoryEditComponent } from './shop-category-edit/shop-category-edit.component';
import { MyWinComponent } from './my-win/my-win.component';
import { MyWinEditComponent } from './my-win-edit/my-win-edit.component';
import { VouchersGroupListComponent } from './vouchers-group-list/vouchers-group-list.component';
import { VouchersGroupDetailsComponent } from './vouchers-group-details/vouchers-group-details.component';
import { VouchersGroupsNewComponent } from './vouchers-groups-new/vouchers-groups-new.component';
import { MissionListComponent } from './mission-list/mission-list.component';
import { MissionNewComponent } from './mission-new/mission-new.component';
import { MissionEditComponent } from './mission-edit/mission-edit.component';

@NgModule({
  imports: [

    MaterialModule,
    DataTableModule,
    BrowserModule,
    FormsModule,
    DatePickerModule,
    HttpModule,
    InputTextModule,
    GMapModule,
    routing,
    MessagesModule,
    GrowlModule,
    CarouselModule,
    CheckboxModule,
    TabViewModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    DialogModule,
    FileUploadModule,
    SharedModule

  ],
  declarations: [
    PosDetailComponent, PosListComponent, ShopTypeListComponent, ShopTypeDetailComponent, MaxValueValidator,
    MenuComponent, LoginComponent, ShopAdminDetailComponent, ShopAdminListComponent, WShopAdminListComponent, ControlMessages,
    VoucherDetailComponent, VoucherListComponent, ShopListComponent, ShopDetailComponent, ItemListComponent, ItemDetailComponent, FlashsellListComponent,
    FlashsellDetailComponent, CouponListComponent, CouponDetailComponent, UserDetailComponent, UserListComponent, AppComponent, SurveyListComponent, SurveyDetailComponent, GiftVoucherListComponent, PaymentOptionsDetailComponent, SalesOrderListComponent, BannerEditComponent, LoyaltyPointsListComponent, GoBackButtonComponent, CategoryListComponent, NotificationListComponent, NotificationDetailComponent, WelcomeVoucherListComponent, ShopCategoryListComponent, ShopCategoryNewComponent, ShopCategoryEditComponent, MyWinComponent, MyWinEditComponent, VouchersGroupListComponent, VouchersGroupDetailsComponent, VouchersGroupsNewComponent, MissionListComponent, MissionNewComponent, MissionEditComponent,
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    LoggedInGuard, AuthService, SaleVoucherShopService, GiftVoucherService, ShopExtService, ProductExtService, ProductMainCategoryService, ShopPaymentConfigService, ShopSalesOrderService, BannerService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [AppComponent],
})


export class AppModule {
  constructor(private _appRef: ApplicationRef) { }

  ngDoBootstrap() {
    this._appRef.bootstrap(AppComponent);
  }
}