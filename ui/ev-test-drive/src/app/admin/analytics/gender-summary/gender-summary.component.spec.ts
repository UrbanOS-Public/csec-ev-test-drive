import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenderSummaryComponent } from './gender-summary.component';

describe('GenderSummaryComponent', () => {
  let component: GenderSummaryComponent;
  let fixture: ComponentFixture<GenderSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenderSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenderSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
