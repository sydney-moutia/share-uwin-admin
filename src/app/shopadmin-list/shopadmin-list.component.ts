import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { ShopAdminService, ShopAdminServiceQuery } from '../service/shopadmin.service';
import { ShopAdmin } from '../pojo/shopadmin';
import {Message, LazyLoadEvent} from 'primeng/primeng';

@Component({
  //moduleId: module.id,
  selector: 'app-shopadmin-list',
  templateUrl: 'shopadmin-list.component.html',
  styleUrls: ['shopadmin-list.component.css'],
  providers: [ShopAdminService],
})
export class ShopAdminListComponent implements OnInit {
  @Input() idShop: string;
  @Input() mode: string = "ADMIN"; // Mode can be Search or Admin (default)
  @Output() selected:  EventEmitter<any> = new EventEmitter();
  @Input() inDialog : boolean = false;

  shopAdmins:   ShopAdmin[];
  selectedShopAdmin: ShopAdmin;

  nbResult: number;

  msgs: Message[] = [];  

  limit: number = 15;

  searchText = "";

  includeGhost: boolean;

  globalFilter : string = "";

  
  constructor(
      private shopAdminService: ShopAdminService
  ) {}

 getShopAdmins(idShop : string, query: ShopAdminServiceQuery): void {
 
   //let query : ShopAdminServiceQuery  = new ShopAdminServiceQuery('',this.skip,this.limit, "lName",1);

    this.shopAdminService.getShopAdmins(idShop,query).subscribe(
      queryResult => {
        this.shopAdmins = queryResult.shopAdmins?queryResult.shopAdmins:[];
        this.nbResult = queryResult.nbResult;
      },
      error =>  this.msgs.push({severity:'error', summary:'Shop admin List', detail:error})
    );  
  }

   loadLazy(event: LazyLoadEvent) {
        //in a real application, make a remote request to load data using state metadata from event
        //event.first = First row offset
        //event.rows = Number of rows per page
        //event.sortField = Field name to sort with
        //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
        //filters: FilterMetadata object having field as key and filter value, filter matchMode as value
        if (this.globalFilter !== this.searchText || this.globalFilter === "" ) {
          let query : ShopAdminServiceQuery  = new ShopAdminServiceQuery(this.searchText,event.first,event.rows,event.sortField,event.sortOrder,this.includeGhost,false);
          this.getShopAdmins(this.idShop, query);
          this.globalFilter = this.searchText;
        }
        
        
    }



  ngOnInit() { 

    this.includeGhost = (this.mode !== "ADMIN");
    let query : ShopAdminServiceQuery  = new ShopAdminServiceQuery('',0,this.limit,"lName",1,this.includeGhost,false);
    this.getShopAdmins(this.idShop, query);
  }

  onRowSelect (event) {            
    this.selectedShopAdmin = event.data;
    this.selected.emit(event.data);
  }

  onNewShopAdmin() {
    this.selectedShopAdmin = new ShopAdmin();
  }  

  onDeletedShopAdmin(shopAdmin: ShopAdmin) {
    // update the shopAdmin list if a shopAdmin has been deleted
    let indx = this.shopAdmins.findIndex(aShopAdmin => aShopAdmin === shopAdmin);

    if (indx>=0) {
      this.shopAdmins.splice(indx, 1);
       this.selectedShopAdmin = null;
    }

  }

  onSavedShopAdmin (shopAdmin : ShopAdmin): void {
    // update the shopadmin list if a new shopadmin has been created
    let indx = this.shopAdmins.findIndex(aShopAdmin => aShopAdmin === shopAdmin);

    if (indx<0) {
      this.shopAdmins.unshift(shopAdmin);
    }

    this.selectedShopAdmin = shopAdmin;

    if (this.mode !== "ADMIN") {
          this.selected.emit(shopAdmin);
    }

  }


  onGoBack() {
    window.history.back();
  } 



}


