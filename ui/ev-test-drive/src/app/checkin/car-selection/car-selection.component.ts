import { Component, OnInit } from '@angular/core';
import { EVService } from '../../common/ev.service';


@Component({
  selector: 'app-car-selection',
  templateUrl: './car-selection.component.html',
  styleUrls: ['./car-selection.component.scss']
})
export class CarSelectionComponent implements OnInit {

  constructor(private evService: EVService) { }

  ngOnInit() {
    this.getCars();
  }

  getCars() {
    
  }

}
