import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotAloneComponent } from './not-alone.component';

describe('NotAloneComponent', () => {
  let component: NotAloneComponent;
  let fixture: ComponentFixture<NotAloneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotAloneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotAloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
