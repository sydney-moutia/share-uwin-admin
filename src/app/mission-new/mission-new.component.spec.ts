/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MissionNewComponent } from './mission-new.component';

describe('MissionNewComponent', () => {
  let component: MissionNewComponent;
  let fixture: ComponentFixture<MissionNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissionNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
