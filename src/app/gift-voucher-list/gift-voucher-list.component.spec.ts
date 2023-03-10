/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GiftVoucherListComponent } from './gift-voucher-list.component';

describe('GiftVoucherListComponent', () => {
  let component: GiftVoucherListComponent;
  let fixture: ComponentFixture<GiftVoucherListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftVoucherListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftVoucherListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
