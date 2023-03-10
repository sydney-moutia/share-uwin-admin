import { Component, OnInit } from '@angular/core';
import { ShopSalesOrderService } from '../service/shop-sales-order.service';
import { ShopSalesOrder } from '../pojo/shop_sales_order';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

interface SalesOrderDataTable {
  id: string;
  date: string;
  customerName: string;
  total: string;
}

@Component({
  selector: 'app-sales-order-list',
  templateUrl: './sales-order-list.component.html',
  styleUrls: ['./sales-order-list.component.css']
})
export class SalesOrderListComponent implements OnInit {
  soList: SalesOrderDataTable[];
  shopName: string;
  showPreloader = true;
  error: any;

  constructor(
    private soService: ShopSalesOrderService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.shopName = localStorage.getItem('shop_name');
    this.route.params
      .switchMap(
        params => this.soService.cget(params['id'])
      )
      .map(this.transformData)
      .subscribe(
        soList => {
          this.soList = soList
          this.showPreloader = false;
        },
        err => {
          this.error = err;
          console.error(err)
          this.showPreloader = false;
        }
      );
  }

  transformData(soList: ShopSalesOrder[]): SalesOrderDataTable[] {
    return soList.map(so => {
      return {
        id: so.id,
        date: moment(so.createdAt).format('Do MMMM YYYY'),
        customerName: `${so.shippingDetails.firstName} ${so.shippingDetails.lastName}`,
        total: (so.total / 100).toFixed(2),
      }
    }
    );
  }

  onRowSelect(event: any) {
    console.error('Not implemented yet.');
  }

  onGoBack() {
    window.history.back();
  }
}
