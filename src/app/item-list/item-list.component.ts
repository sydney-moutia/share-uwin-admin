import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ItemService } from '../service/item.service';
import { Item } from '../pojo/item';
import {Message} from 'primeng/primeng';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  //moduleId: module.id,
  selector: 'app-item-list',
  templateUrl: 'item-list.component.html',
  styleUrls: ['item-list.component.css'],
  providers: [ItemService],
})
export class ItemListComponent implements OnInit, OnDestroy {
  @Input() idShop: string;

  items: Item[];
  selectedItem: Item;
  sub: any;
  msgs: Message[] = [];  

  shopName : string;

  constructor(
      private itemService: ItemService,
       private route: ActivatedRoute        
  ) {}

 getItems(idShop : string): void {
    this.itemService.getItems(idShop).subscribe(
      items => this.items = items,
      error =>  this.msgs.push({severity:'error', summary:'Item List', detail:error})
    );  
  }

  ngOnInit() { 

    if (!this.idShop) {
          this.sub = this.route.params.subscribe(params => {
            this.idShop = params['id'];
          });
      }


    this.getItems(this.idShop);

    // this.shopName = localStorage.getItem('shop_name');
  }

  onRowSelect (event) {
    this.selectedItem = event.data;
  }

  onNewItem() {
    this.selectedItem = new Item();
    // this.selectedItem.idShop = this.idShop;
  }  

  ngOnDestroy(){
        if (this.sub) this.sub.unsubscribe();
  }

  onGoBack() {
    window.history.back();
  }


}


