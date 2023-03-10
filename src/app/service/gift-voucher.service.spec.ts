/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GiftVoucherService } from './gift-voucher.service';

describe('GiftVoucherService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GiftVoucherService]
    });
  });

  it('should ...', inject([GiftVoucherService], (service: GiftVoucherService) => {
    expect(service).toBeTruthy();
  }));
});
