/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SaleVoucherShopService } from './sale-voucher-shop.service';

describe('SaleVoucherShopService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SaleVoucherShopService]
    });
  });

  it('should ...', inject([SaleVoucherShopService], (service: SaleVoucherShopService) => {
    expect(service).toBeTruthy();
  }));
});
