/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProductExtService } from './product-ext.service';

describe('ProductExtService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductExtService]
    });
  });

  it('should ...', inject([ProductExtService], (service: ProductExtService) => {
    expect(service).toBeTruthy();
  }));
});
