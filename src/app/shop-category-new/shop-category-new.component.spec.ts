/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ShopCategoryNewComponent } from './shop-category-new.component';

describe('ShopCategoryNewComponent', () => {
  let component: ShopCategoryNewComponent;
  let fixture: ComponentFixture<ShopCategoryNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopCategoryNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopCategoryNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
