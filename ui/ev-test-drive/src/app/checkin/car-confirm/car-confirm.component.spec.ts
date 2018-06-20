import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfirmComponent } from './car-confirm.component';

describe('CarConfirmComponent', () => {
  let component: CarConfirmComponent;
  let fixture: ComponentFixture<CarConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
