import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { surveySubmitUrl } from 'src/app/app.constants';
import { Helpers } from '../../../app.helpers';
import { CarSelectionComponent } from 'src/app/checkin/car-selection/car-selection.component';

@Component({
  selector: 'app-edit-reservation',
  templateUrl: './edit-reservation.component.html',
  styleUrls: ['./edit-reservation.component.scss']
})
export class EditReservationComponent implements OnInit, OnChanges {
  @Input() reservation: any;
  @Output() submit = new EventEmitter<any>();
  @Input() times;
  @Input() cars;
  filteredTimes;
  days;
  helpers = new Helpers();
  isSubmitting = false;
  selectedTime;
  selectedCar;

  constructor() { }

  ngOnInit() {

  }  

  ngOnChanges() {
    if (this.times && this.times.length > 0) {
      this.getDays();
      this.getTimes();
      this.filterTimes();
      this.doSelectTime(this.reservation.time)
      this.doSelectCar(this.reservation.vehicle)
    }
  }

  getCarSlotId(time, carId) {
    var carSlotId
    if(time){
      time.cars.forEach(carSlot => {
        if (carSlot.carId == carId) {
          carSlotId = carSlot.carSlotId;
        }
      });
    }
    return carSlotId;
  }

  doSubmit() {
    var timeObject = this.filteredTimes.find(time => time.startTime == this.reservation.time);
    this.reservation.carSlotId = this.getCarSlotId(timeObject, this.reservation.vehicle);
    this.submit.emit({...this.reservation});
  }

  getDays() {
    const unique = new Set(this.times.map(item => item.date));
    this.days = Array.from(unique);
  }

  getTimes() {
    this.times.forEach((time) => {
      time.formattedTime = this.helpers.formatAMPM(time.startTime);
    });
  }

  filterTimes() {
    this.filteredTimes = this.times.filter((time) => {
      return time.date == this.reservation.day;
    });
  }

  clearForm() {
    this.reservation.time = null;
    this.reservation.vehicle = null;
    this.updateCarStatesForTime(null);
    this.updateTimeStatesForCar(null);
  }

  doSelectTime(selectedTime) {
    selectedTime = this.times.find(time => time.startTime == selectedTime);
    if (!selectedTime || selectedTime.disabled || selectedTime.availableCount <= 0) {
      return;
    }
    this.updateCarStatesForTime(selectedTime);
  }

  doSelectCar(selectedCar) {
    selectedCar = this.cars.find(car => car.id == selectedCar);
    if (!selectedCar || selectedCar.unavailable) {
      return;
    }
    this.updateTimeStatesForCar(selectedCar);
  }

  updateCarStatesForTime(time) {
    if (time) {
      time.cars.forEach(carSlot => {
        var carInSlot = this.cars.find((car) => {
          return car.id == carSlot.carId;
        });
        carInSlot.unavailable = carSlot.reserved;
        if (carSlot.reserved) {
          carInSlot.selected = false;
          if (carInSlot == this.selectedCar){
            this.selectedCar = null;
          }
        }
      });
    } else {
      this.clearCarAvailableStates();
    }
  }

  updateTimeStatesForCar(car) {
    this.clearTimeAvailableStates();
    if (car) {
      this.times.forEach(time => {
        var carForSlot = time.cars.find((carSlot) => carSlot.carId == car.id);
        if (carForSlot && carForSlot.reserved) {
          time.disabled = true;
          time.selected = false;
          if (time == this.selectedTime) {
            this.selectedTime = null;
          }
        }
      });
    }
  }

  clearCarAvailableStates(){
    this.cars.forEach((car) => {
      car.unavailable = false;
    });
  }

  clearSelectedStates(list){
    list.forEach((thing) => {
      thing.selected = false;
    });
  }

  clearTimeAvailableStates(){
    this.times.forEach((time) => {
      time.disabled = false;
    });
  }

}
