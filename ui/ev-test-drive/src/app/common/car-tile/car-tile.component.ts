import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'car-tile',
  templateUrl: './car-tile.component.html',
  styleUrls: ['./car-tile.component.scss']
})
export class CarTileComponent implements OnInit {
  @Input() car: any = { specs: {} };
  totalRangeText: string = "";

  constructor() { }

  ngOnInit() {
    if (this.car.type.indexOf("BEV") == -1) {
      this.totalRangeText = "(" + this.car.specs.totalRange + " total with gas)";
    }
  }

}
