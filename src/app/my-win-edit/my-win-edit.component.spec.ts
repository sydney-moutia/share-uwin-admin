/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MyWinEditComponent } from './my-win-edit.component';

describe('MyWinEditComponent', () => {
  let component: MyWinEditComponent;
  let fixture: ComponentFixture<MyWinEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyWinEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyWinEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
