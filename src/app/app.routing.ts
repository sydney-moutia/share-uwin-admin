import { Component, ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ShopCategoryListComponent } from "./shop-category-list/shop-category-list.component";
import { ShopCategoryNewComponent } from "./shop-category-new/shop-category-new.component";
import { ShopCategoryEditComponent } from "./shop-category-edit/shop-category-edit.component";
import { LoginComponent } from "./login/login.component";
import { ShopListComponent } from "./shop-list/shop-list.component";
import { PosListComponent } from "./pos-list/pos-list.component";
import { FlashsellListComponent } from "./flashsell-list/flashsell-list.component";
import { ShopAdminListComponent } from "./shopadmin-list/shopadmin-list.component";
import { UserListComponent } from "./user-list/user-list.component";
import { SurveyListComponent } from "./survey-list/survey-list.component";
import { MenuComponent } from "./menu/menu.component";
import { ShopDetailComponent } from "./shop-detail/shop-detail.component";
import { ItemListComponent } from "./item-list/item-list.component";
import { CouponListComponent } from "./coupon-list/coupon-list.component";
import { VoucherListComponent } from "./voucher-list/voucher-list.component";
import { ShopAdminDetailComponent } from "./shopadmin-detail/shopadmin-detail.component";
import { ShopTypeListComponent } from "./shoptype-list/shoptype-list.component";
import { AppComponent } from "./app.component";
import { LoggedInGuard } from "./service/auth.service";
import { GiftVoucherListComponent } from "./gift-voucher-list/gift-voucher-list.component";
import { PaymentOptionsDetailComponent } from "./payment-options-detail/payment-options-detail.component";
import { SalesOrderListComponent } from "./sales-order-list/sales-order-list.component";
import { BannerEditComponent } from "./banner-edit/banner-edit.component";
import { LoyaltyPointsListComponent } from "./loyalty-points-list/loyalty-points-list.component";
import { CategoryListComponent } from "./category-list/category-list.component";
import { NotificationListComponent } from "./notification-list/notification-list.component";
import { WelcomeVoucherListComponent } from "./welcome-voucher-list/welcome-voucher-list.component";
import { MyWinComponent } from "./my-win/my-win.component";
import { MyWinEditComponent } from "./my-win-edit/my-win-edit.component";
import { VouchersGroupListComponent } from "./vouchers-group-list/vouchers-group-list.component";
import { VouchersGroupsNewComponent } from "./vouchers-groups-new/vouchers-groups-new.component";
import { MissionListComponent } from "./mission-list/mission-list.component";
import { MissionNewComponent } from "./mission-new/mission-new.component";
import { MissionEditComponent } from "./mission-edit/mission-edit.component";

const appRoutes: Routes = [
  {
    path: "welcome-vouchers",
    component: WelcomeVoucherListComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: "shops",
    component: ShopListComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: "banners/edit",
    component: BannerEditComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: "shops",
    component: ShopListComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: "my-wins",
    component: MyWinComponent,
    canActivate: [LoggedInGuard],
    children: [
      {
        path: ":id/edit",
        component: MyWinEditComponent,
      },
    ],
  },
  {
    path: "users",
    component: UserListComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: "surveys",
    component: SurveyListComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: "shoptypes",
    component: ShopTypeListComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: "shopadmins",
    component: ShopAdminListComponent,
    canActivate: [LoggedInGuard],
  } /*
  {
    path: 'shopadmins/:id',
    component: ShopAdminDetailComponent,
    canActivate: [LoggedInGuard] 
  },  */,
  {
    path: "detail/:id",
    component: ShopDetailComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: "detail/:id/pos",
    component: PosListComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: "detail/:id/catalog",
    component: ItemListComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: "detail/:id/coupons",
    component: CouponListComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: "detail/:id/flashsells",
    component: FlashsellListComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: "detail/:id/vouchers",
    component: VoucherListComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: "detail/:id/gift-vouchers",
    component: GiftVoucherListComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: "detail/:id/sales-orders",
    component: SalesOrderListComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: "detail/:id/payment-options",
    component: PaymentOptionsDetailComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: "detail/:id/loyalty-points",
    component: LoyaltyPointsListComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: "uWinAdmin",
    component: ShopListComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "menu/:id",
    component: MenuComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: "menu",
    component: MenuComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: "shop-categories",
    component: ShopCategoryListComponent,
    canActivate: [LoggedInGuard],
    children: [
      {
        path: "new",
        component: ShopCategoryNewComponent,
      },
      {
        path: ":id/edit",
        component: ShopCategoryEditComponent,
      },
    ],
  },
  {
    path: "categories",
    component: CategoryListComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: "notifications",
    component: NotificationListComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: "missions",
    component: MissionListComponent,
    canActivate: [LoggedInGuard],
    children: [
      {
        path: "new",
        component: MissionNewComponent,
      },
      {
        path: ":id/edit",
        component: MissionEditComponent,
      },
    ],
  },
  {
    path: "vouchers-groups",
    component: VouchersGroupListComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: "vouchers-groups/new",
    component: VouchersGroupsNewComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full",
  },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
