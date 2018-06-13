import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinWelcomeComponent } from './checkin-welcome.component';

describe('CheckinWelcomeComponent', () => {
  let component: CheckinWelcomeComponent;
  let fixture: ComponentFixture<CheckinWelcomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckinWelcomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
