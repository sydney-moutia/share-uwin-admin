/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MainCategoryService } from './main-category.service';

describe('MainCategoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MainCategoryService]
    });
  });

  it('should ...', inject([MainCategoryService], (service: MainCategoryService) => {
    expect(service).toBeTruthy();
  }));
});
