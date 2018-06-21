import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutWelcomeComponent } from './checkout-welcome.component';

describe('CheckoutWelcomeComponent', () => {
  let component: CheckoutWelcomeComponent;
  let fixture: ComponentFixture<CheckoutWelcomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutWelcomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
