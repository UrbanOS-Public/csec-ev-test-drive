import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppRawDataComponent } from './app-raw-data.component';

describe('AppRawDataComponent', () => {
  let component: AppRawDataComponent;
  let fixture: ComponentFixture<AppRawDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppRawDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppRawDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
