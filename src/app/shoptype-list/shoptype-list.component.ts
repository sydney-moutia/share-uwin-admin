import { Component, OnInit } from '@angular/core';
import { ShopTypeService } from '../service/shopType.service'
import { AuthService } from '../service/auth.service'
import { ShopType } from '../pojo/shopType';
import { Router } from '@angular/router';

import {Message} from 'primeng/primeng';


@Component({
  //moduleId: module.id,
  selector: 'app-shoptype-list',
  templateUrl: 'shoptype-list.component.html',
  styleUrls: ['shoptype-list.component.css'],
  providers: [ShopTypeService]
})

export class ShopTypeListComponent implements OnInit {

  error: any;
  shopTypes: ShopType[];
  selectedShopType: ShopType;


  msgs: Message[] = [];

  constructor(
            private router: Router,
            private shopTypeService: ShopTypeService,
            private authService: AuthService) {
  }


  getShopTypes(): void {
    this.shopTypeService.getShopTypes().subscribe(
      shopTypes => this.shopTypes = shopTypes,
      error =>  this.msgs.push({severity:'error', summary:'ShopType List', detail:error})
    );  
  }
  
  ngOnInit() {
    this.getShopTypes();
  }


    onRowSelect(event) {
        this.selectedShopType = event.data;
    }


  onNewShopType() {
    this.selectedShopType = new ShopType();
  }  

  savedShopType (shopType : ShopType): void {
    // update the voucher list is a new voucher has been created
    let indx = this.shopTypes.findIndex(aShopType => aShopType === shopType);

    if (indx<0) {
      this.shopTypes.push(shopType);
    }

    this.selectedShopType = shopType;

  }

  deletedShopType (shopType: ShopType) : void {
    // update the voucher list if a voucher has been deleted
    let indx = this.shopTypes.findIndex(aShopType => aShopType === shopType);

    if (indx>=0) {
      this.shopTypes.splice(indx, 1);
    }
  }

  onGoBack() {
    window.history.back();
  } 

  
}
