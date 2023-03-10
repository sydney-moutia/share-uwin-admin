/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MissionListComponent } from './mission-list.component';

describe('MissionListComponent', () => {
  let component: MissionListComponent;
  let fixture: ComponentFixture<MissionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
