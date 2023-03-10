/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { VouchersGroupService } from './vouchers-group.service';

describe('VouchersGroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VouchersGroupService]
    });
  });

  it('should ...', inject([VouchersGroupService], (service: VouchersGroupService) => {
    expect(service).toBeTruthy();
  }));
});
