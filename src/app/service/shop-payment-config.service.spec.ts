/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ShopPaymentConfigService } from './shop-payment-config.service';

describe('ShopPaymentConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShopPaymentConfigService]
    });
  });

  it('should ...', inject([ShopPaymentConfigService], (service: ShopPaymentConfigService) => {
    expect(service).toBeTruthy();
  }));
});
