import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarTileComponent } from './car-tile.component';

describe('CarTileComponent', () => {
  let component: CarTileComponent;
  let fixture: ComponentFixture<CarTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
