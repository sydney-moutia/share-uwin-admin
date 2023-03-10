import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ShopAdmin } from '../../pojo/shopadmin';
import {Message} from 'primeng/primeng';
import {DialogModule} from 'primeng/primeng';

@Component({
  //moduleId: module.id,
  selector: 'app-w-shopadmin-list',
  templateUrl: 'w-shopadmin-list.component.html',
  styleUrls: [ 'w-shopadmin-list.component.css'],
  providers: [],
})
export class WShopAdminListComponent implements OnInit {
  @Input() shopAdminList: ShopAdmin[];
  @Input() label: string;
  @Output() selectedShopAdmin: ShopAdmin; 
  @Output() updated: EventEmitter<any> = new EventEmitter();

  display: boolean = false;

  userRole: string;
  userId: string;

  constructor() {}

  ngOnInit() {

    this.userRole = localStorage.getItem('auth_role');
    this.userId = localStorage.getItem('auth_id');

    if (!this.shopAdminList) {
      this.shopAdminList = [];
    }
  }

  onRowSelect (event) {
    this.selectedShopAdmin = event.data;
  }

  onSelectedShopAdmin (shopAdmin:ShopAdmin) {
    this.display = false;

    if (!this.shopAdminList.find((sa) => {return sa.id === shopAdmin.id})) {
      this.shopAdminList.push(shopAdmin);
      this.updated.emit();
    }
    
  }

  onRemoveShopAdmin  (shopAdmin:ShopAdmin) {
    if (this.shopAdminList) {
      let indx : number = this.shopAdminList.findIndex((sa) => {return sa.id === shopAdmin.id});
      if (indx >= 0)  this.shopAdminList.splice(indx,1);
      this.updated.emit();
    }
  }

  showDialog() {
     this.display = true;
  }
}


