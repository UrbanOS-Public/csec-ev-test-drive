import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdhocReservationComponent } from './adhoc-reservation.component';

describe('AdhocReservationComponent', () => {
  let component: AdhocReservationComponent;
  let fixture: ComponentFixture<AdhocReservationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdhocReservationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdhocReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
