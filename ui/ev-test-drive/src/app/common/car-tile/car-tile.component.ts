import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'car-tile',
  templateUrl: './car-tile.component.html',
  styleUrls: ['./car-tile.component.scss']
})
export class CarTileComponent implements OnInit {
  @Input() car: any = { specs: {} };

  constructor() { }

  ngOnInit() {
  }

}
