import { Component, OnInit } from '@angular/core';
import { ShopService } from '../service/shop.service'
import { AuthService } from '../service/auth.service'
import { Shop } from '../pojo/shop';
import { Router } from '@angular/router';

import {Message} from 'primeng/primeng';


@Component({
  //moduleId: module.id,
  selector: 'app-shop-list',
  templateUrl: 'shop-list.component.html',
  styleUrls: ['shop-list.component.css'],
  providers: [ShopService]
})

export class ShopListComponent implements OnInit {

  error: any;
  shops: Shop[];
  selectedShop: Shop;
  isAdmin : boolean;

 msgs: Message[] = [];

  constructor(
            private router: Router,
            private shopService: ShopService,
            private authService: AuthService) {
  }

/*
  getShops(): void {
    this.shopService.getShops().then(shops => this.shops = shops);
    
  }
  */

  getShops(): void {
    this.shopService.getShops().subscribe(
      shops => this.shops = shops,
      error =>  this.msgs.push({severity:'error', summary:'Shop List', detail:error})
    );  
  }
  
  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.getShops();
  }


    onRowSelect(event) {
        this.selectedShop = event.data;
        localStorage.setItem('shop_name', event.data.name);
        let link = ['/menu', this.selectedShop.id];
        this.router.navigate(link);
    }

    onNewShop() {
        this.selectedShop = null;
        let link = ['/detail', '*'];
        this.router.navigate(link);
    }    


  onGoBack() {
    window.history.back();
  } 
}
