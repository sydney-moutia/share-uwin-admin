import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { FlashSell } from '../pojo/flashsell';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FlashSellService } from '../service/flashsell.service'
import { ShopService } from '../service/shop.service'
import { Message } from 'primeng/primeng';

@Component({
  //moduleId: module.id,
  selector: 'app-flashsell-list',
  templateUrl: 'flashsell-list.component.html',
  styleUrls: ['flashsell-list.component.css'],
  providers: [FlashSellService, ShopService],
})
export class FlashsellListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() idShop: string;
  @Input() refreshMe: boolean;

  sub: any;
  flashsells: FlashSell[];
  selectedFlashsell: FlashSell;

  shopName: string;

  msgs: Message[] = [];

  constructor(
    private flashsellService: FlashSellService,
    private route: ActivatedRoute
  ) { }

  getFlashsells(idShop: string): void {
    this.flashsellService.getItems(idShop).subscribe(
      flashsells => this.flashsells = flashsells,
      error => {
        console.error('Could not fetch flash sale list');
        console.error(error);
        this.msgs.push({ severity: 'error', summary: 'Flash Sale List', detail: error })
      }
    );
  }

  ngOnInit() {
    if (!this.idShop) {
      this.sub = this.route.params.subscribe(params => {
        this.idShop = params['id'];
      });
    }

    this.getFlashsells(this.idShop);
    this.shopName = localStorage.getItem('shop_name');
  }

  onRowSelect(event) {
    this.selectedFlashsell = event.data;
  }

  onNewItem() {
    this.selectedFlashsell = new FlashSell();
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['refreshMe'] != undefined) {

      let changedItem = changes['refreshMe'].currentValue;
      if (changedItem != undefined && changedItem != null) {

        this.getFlashsells(this.idShop);

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
