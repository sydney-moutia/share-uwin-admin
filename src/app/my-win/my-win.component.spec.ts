/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MyWinComponent } from './my-win.component';

describe('MyWinComponent', () => {
  let component: MyWinComponent;
  let fixture: ComponentFixture<MyWinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyWinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyWinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
