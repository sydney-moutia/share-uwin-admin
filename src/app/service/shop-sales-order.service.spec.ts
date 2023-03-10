/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ShopSalesOrderService } from './shop-sales-order.service';

describe('ShopSalesOrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShopSalesOrderService]
    });
  });

  it('should ...', inject([ShopSalesOrderService], (service: ShopSalesOrderService) => {
    expect(service).toBeTruthy();
  }));
});
