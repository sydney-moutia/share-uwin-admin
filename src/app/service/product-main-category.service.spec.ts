/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProductMainCategoryService } from './product-main-category.service';

describe('ProductMainCategoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductMainCategoryService]
    });
  });

  it('should ...', inject([ProductMainCategoryService], (service: ProductMainCategoryService) => {
    expect(service).toBeTruthy();
  }));
});
