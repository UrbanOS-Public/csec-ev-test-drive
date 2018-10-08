import { Component, Input, OnInit } from '@angular/core';
import { HostListener } from "@angular/core";

@Component({
  selector: 'car-tile',
  templateUrl: './car-tile.component.html',
  styleUrls: ['./car-tile.component.scss']
})
export class CarTileComponent implements OnInit {
  @Input() car: any = { specs: {} };
  @Input() collapsed = false;
  @Input() showInactive = false;
  totalRangeText: string = "";
  screenWidth: number = 0;

  constructor() { 
    this.onResize();
  }

  ngOnInit() {
    if (this.car.type.indexOf("BEV") == -1) {
      this.totalRangeText = "(" + this.car.specs.totalRange + " total with gas)";
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenWidth = window.innerWidth;
  }

  onCollapse() {
    if(this.screenWidth <= 599) {
      this.collapsed = !this.collapsed;
    }
  }

}
