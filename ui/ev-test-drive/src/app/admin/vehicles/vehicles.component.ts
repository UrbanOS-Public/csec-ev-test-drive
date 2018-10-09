import { Component, OnInit } from '@angular/core';
import { EVService } from '../../common/ev.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {
  cars;
  constructor(private evService: EVService) { }

  ngOnInit() {
    this.evService.getCars().subscribe(
      response => this.handleResponse(response), 
      error => this.handleError(error)
    );
  }

  handleResponse(response) {
    this.cars = response.map((car) => {car.unavailable = !car.active; car.selected = car.active; return car;});
  }

  doSelectCar(car) {
    console.log("Placeholder for deactivating:", car);
  }

  handleError(error) {
    console.error(error);
  }
}
