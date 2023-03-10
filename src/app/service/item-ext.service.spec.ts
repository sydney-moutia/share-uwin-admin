/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ItemExtService } from './item-ext.service';

describe('ItemExtService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemExtService]
    });
  });

  it('should ...', inject([ItemExtService], (service: ItemExtService) => {
    expect(service).toBeTruthy();
  }));
});
