/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VouchersGroupsNewComponent } from './vouchers-groups-new.component';

describe('VouchersGroupsNewComponent', () => {
  let component: VouchersGroupsNewComponent;
  let fixture: ComponentFixture<VouchersGroupsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VouchersGroupsNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VouchersGroupsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
