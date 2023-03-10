/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LoyaltyPointService } from './loyalty-point.service';

describe('LoyaltyPointService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoyaltyPointService]
    });
  });

  it('should ...', inject([LoyaltyPointService], (service: LoyaltyPointService) => {
    expect(service).toBeTruthy();
  }));
});
