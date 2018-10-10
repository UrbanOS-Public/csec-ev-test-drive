import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZipcodeSummaryComponent } from './zipcode-summary.component';

describe('ZipcodeSummaryComponent', () => {
  let component: ZipcodeSummaryComponent;
  let fixture: ComponentFixture<ZipcodeSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZipcodeSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZipcodeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
