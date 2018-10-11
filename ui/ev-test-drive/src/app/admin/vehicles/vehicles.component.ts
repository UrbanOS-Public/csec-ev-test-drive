import { Component, OnInit } from '@angular/core';
import { EVService } from '../../common/ev.service';
import { ModalService } from '../../common/modal.service';
import * as globals from '../../app.constants';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {
  cars;
  isSubmitting: boolean = false;
  selectedCar;
  showPinError;
  pin;
  links = globals.adminNavbar;
  constructor(private evService: EVService, private modalService: ModalService) { }
  

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
    this.closeModal('pin-modal');
    this.getCars();
  }

  doChangeVehicleState() {
    this.evService.postCarState({carId:this.selectedCar.id,active:!this.selectedCar.active,pin:this.pin}).subscribe(
      response => this.handleStateResponse(response), 
      error => this.handlePinError(error)
    );
  }

  doSelectCar(car) {
    this.selectedCar = car;
    this.openModal('pin-modal');
  }

  handleError(error) {
    console.error(error);
  }

  handlePinError(error) {
    this.showPinError = true;
    this.isSubmitting = false;
  }

  openModal(id) {
    this.showPinError = false;
    this.modalService.open(id);
  }

  closeModal(id) {
    this.showPinError = false;
    this.modalService.close(id);
  }
}
