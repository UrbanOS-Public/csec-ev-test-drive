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
    this.getCars();
  }

  getCars() {
    this.evService.getCars().subscribe(
      response => this.handleCarResponse(response), 
      error => this.handleError(error)
    );
  }

  handleCarResponse(response) {
    this.cars = response.map((car) => {car.unavailable = !car.active; car.selected = car.active; return car;});
  }

  handleStateResponse(response) {
    this.getCars();
  }

  doSelectCar(car) {
    this.evService.postCarState({carId:car.id,active:!car.active,pin:""}).subscribe(
      response => this.handleStateResponse(response), 
      error => this.handleError(error)
    );
    console.log("Placeholder for deactivating:", car);
  }

  handleError(error) {
    console.error(error);
  }
}
