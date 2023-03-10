/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MyWinMenuItemService } from './my-win-menu-item.service';

describe('MyWinMenuItemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyWinMenuItemService]
    });
  });

  it('should ...', inject([MyWinMenuItemService], (service: MyWinMenuItemService) => {
    expect(service).toBeTruthy();
  }));
});
