import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarReviewComponent } from './car-review.component';

describe('CarReviewComponent', () => {
  let component: CarReviewComponent;
  let fixture: ComponentFixture<CarReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
