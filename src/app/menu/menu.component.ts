import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Message } from 'primeng/primeng';
import { ShopAdminService } from '../service/shopadmin.service';
import { ShopService } from '../service/shop.service';
import { ShopAdmin } from '../pojo/shopadmin';
import { Shop } from '../pojo/shop';

@Component({
  //moduleId: module.id,
  selector: 'app-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.css'],
  providers: [ShopAdminService, ShopService]
})

export class MenuComponent implements OnInit, OnDestroy {
  @Input() idShop: string;
  error: any;
  msgs: Message[] = [];
  menuItems: MenuItem[];
  id: string; // Current userAdmin ID
  role: string;
  shop: Shop = new Shop();
  sub: any;

  constructor(
    private router: Router,
    private shopAdminService: ShopAdminService,
    private shopService: ShopService,
    private route: ActivatedRoute) { }

  getShop(idShop: string) {
    this.shopService.getShop(idShop)
      .subscribe(
        shop => {
          this.shop = shop;
        },
        error => this.msgs.push({ severity: 'error', summary: 'Shop Detail', detail: error })
      );
  }


  ngOnInit() {
    this.id = localStorage.getItem('auth_id');
    this.role = localStorage.getItem('auth_role');

    if (this.id == null) this.router.navigate(['/login']);

    if (!this.idShop) {
      this.sub = this.route.params.subscribe(params => {
        if (this.role !== 'ADMIN' && !params['id']) {
          this.router.navigate(['/shops']);

          return;
        }

        this.idShop = params['id'];
      });
    }

    if (this.idShop) {
      if (this.idShop === "*") {
        this.shop.name = "New Shop";
      } else {
        console.log('idShop', this.idShop);
        this.getShop(this.idShop);
      }
    }

    /*
          if (this.role === "ADMIN" && !this.idShop) {
            this.menuItems = [
              //new MenuItem("My Profile", "Edit your profile", "fa fa-user", "/shopadmins/"+this.id,false),
              new MenuItem("My Shops", "Manage your shops", "fa fa-info-circle", "/shops", false),
              new MenuItem("Surveys", "Manage your surveys", "fa fa-file-text-o", "/surveys", true),
              new MenuItem("Managers", "Manage your managers", "fa fa-users", "/shopadmins", false),
              new MenuItem("User Filtering", "Search users", "fa fa-search", "/users", true),
              new MenuItem("Shop types", "Manage Shop Types", "fa fa-star", "/shoptypes", true)
            ]    
          } else {
            this.menuItems = [
            new MenuItem("General Info", "Manage your shop", "fa fa-info-circle", "/detail/" + this.idShop, false),
            new MenuItem("Points of Sale", "Manage your points of sale", "fa fa-home", "/detail/" + this.idShop +"/pos", false),
            new MenuItem("Catalog", "Manage your shop items", "fa fa-list", "/detail/" + this.idShop +"/catalog", false),
            new MenuItem("Coupons", "Manage your coupons", "fa fa-ticket", "/detail/" + this.idShop +"/coupons", true),
            new MenuItem("Flash Sales", "Manage your flash sales", "fa fa-bell",  "/detail/" + this.idShop +"/flashsells", true),
            new MenuItem("Vouchers", "Manage your vouchers", "fa fa-money","/detail/" + this.idShop +"/vouchers", true),
           ]          
          }
          */

    if (this.role === "ADMIN" && !this.idShop) {
      this.menuItems = [
        //new MenuItem("My Profile", "Edit your profile", "fa fa-user", "/shopadmins/"+this.id,false),
        new MenuItem("My Shops", "Manage your shops", "i-shop.png", "/shops", false),
        new MenuItem("App Banner", "Manage banner on android and iOS", "i-pos.png", "/banners/edit", false),
        new MenuItem("Surveys", "Manage your surveys", "i-survey.png", "/surveys", true),
        new MenuItem("Managers", "Manage your managers", "i-manager.png", "/shopadmins", false),
        new MenuItem("User Filtering", "Search users", "i-filtering.png", "/users", true),
        new MenuItem("Shop types", "Manage Shop Types", "i-shoptype.png", "/shoptypes", true),
        new MenuItem("Shop Categories", "Manage Shops Categories", "i-catalog.png", "/shop-categories", true),
        new MenuItem("Catalog Categories", "Manage Catalog Categories", "i-catalog.png", "/categories", true),
        new MenuItem("Notification", "Manage Notification", "i-loud-speaker.png", "/notifications", true),
        new MenuItem("Missions", "Manage missions", "i-shoptype.png", "/missions", true),
        new MenuItem("Vouchers Group", "Manage vouchers groups", "i-voucher.png", "/vouchers-groups", true),
        new MenuItem("My Win Menu", "Manage My Wins menu", "i-catalog.png", "/my-wins", true),
      ]
    } else {
      this.menuItems = [
        new MenuItem("General Info", "Manage your shop", "i-info.png", "/detail/" + this.idShop, false),
        new MenuItem("Points of Sale", "Manage your points of sale", "i-pos.png", "/detail/" + this.idShop + "/pos", false),
        new MenuItem("Orders", "Manage your orders", "i-shop.png", "/detail/" + this.idShop + "/sales-orders", false),
        new MenuItem("Catalog", "Manage your shop items", "i-catalog.png", "/detail/" + this.idShop + "/catalog", false),
        new MenuItem("Coupons", "Manage your coupons", "i-coupon.png", "/detail/" + this.idShop + "/coupons", true),
        new MenuItem("Flash Sales", "Manage your flash sales", "i-flashsale.png", "/detail/" + this.idShop + "/flashsells", true),
        new MenuItem("Vouchers", "Manage your vouchers", "i-voucher.png", "/detail/" + this.idShop + "/vouchers", true),
        new MenuItem("Gift Vouchers", "Manage gift vouchers", "i-voucher.png", "/detail/" + this.idShop + "/gift-vouchers", true),
        new MenuItem("Loyalty points", "View members loyalty points", "i-shop.png", "/detail/" + this.idShop + "/loyalty-points", false),
      ];

      if (this.role === "ADMIN") {
        this.menuItems.push(
          new MenuItem("Payment Options", "Manage your payment options", "i-catalog.png", "/detail/" + this.idShop + "/payment-options", false)
        );
      }
    }

  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  onGoBack() {
    window.history.back();
  }

}

export class MenuItem {
  constructor(private title: string, private subtitle: string, private imageName: string, private url: string, private adminOnly: boolean) { }
}


/*
export class MenuItem  {
  constructor(private title:string, private subtitle:string, private className: string, private url: string, private adminOnly: boolean) {}
}
*/

