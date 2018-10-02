import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EVService } from '../../common/ev.service';
import { ModalService } from '../../common/modal.service';
import { Helpers } from '../../app.helpers';
import * as moment from 'moment';

@Component({
  selector: 'app-car-selection',
  templateUrl: './car-selection.component.html',
  styleUrls: ['./car-selection.component.scss']
})
export class CarSelectionComponent implements OnInit {

  helpers = new Helpers();
  carCounter = 0;
  timeCounter = 0;
  cars: any[] = [];
  times: any[] = [];
  allTimes: any[] = [];
  selectedCar: any;
  selectedTime: any;
  formattedDate: string;
  isSubmitting = false;
  day: any = moment().format('YYYY-MM-DD');

  constructor(
    private evService: EVService,
    private router: Router,
    private modalService: ModalService) { }

  ngOnInit() {
    if (localStorage.getItem('email')) {
      this.getCars();
      this.getTimes();
    } else {
      // this.router.navigateByUrl('/checkin');
    }
  }

  ngAfterViewInit() {
    if (this.selectedCar && this.selectedTime) {

      // Select asynchronously to avoid conflicts with change detection
      setTimeout(() => {
        // this.doSelectCar(this.selectedCar.tileId);
        // this.doSelectTime(this.selectedTime.tileId);
      });
    }
  }

  getCars() {
    this.cars = JSON.parse(localStorage.getItem('cars'));
  }

  getTimes() {
    this.times = JSON.parse(localStorage.getItem('times'));
    this.times.forEach((time) => {
      time.formattedTime = this.helpers.formatAMPM(time.startTime);
    });
  }

  doSelectTime(selectedTime) {
    const timeState = !selectedTime.selected;
    if (this.selectedTime != selectedTime) {
      this.selectedTime = selectedTime;
    } else {
      this.selectedTime = null;
    }

    this.times.forEach((time) => {
      time.selected = false;
    });
    selectedTime.selected = timeState;
    this.updateCarStatesForTime(this.selectedTime);
  }

  doSelectCar(selectedCar) {
    if (selectedCar.unavailable) {
      return;
    }
    this.selectedCar = selectedCar;
    const carState = !selectedCar.selected;
    this.cars.forEach((car) => {
      car.selected = false;
    });
    selectedCar.selected = carState;
  }

  updateCarStatesForTime(time) {
    this.clearCarStates();
    if (time) {
      time.cars.forEach(carSlot => {
        var carInSlot = this.cars.find((car) => {
          return car.id == carSlot.carId;
        });
        carInSlot.unavailable = carSlot.reserved;
      });
    }
  }

  clearCarStates(){
    this.cars.forEach((car) => {
      car.unavailable = false;
      car.selected = false;
    });
  }

  clearTimeStates(){
    this.times.forEach((time) => {
      time.selected = false;
    });
  }

  doReset(){
    this.clearCarStates();
    this.clearTimeStates();
    this.selectedCar = null;
    this.selectedTime = null;
  }

  formatDate(date: Date) {
    const today = new Date();
    const months = ['January', 'February', 'March', 'April',
                    'May', 'June', 'July', 'August', 'September',
                    'October', 'November', 'December'];
    let dateStr = '';
    
    if (today.getMonth() === date.getMonth()
     && today.getDate() === date.getDate()
     && today.getFullYear() === date.getFullYear()) {
      dateStr += 'Today, ';
    }

    dateStr += `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

    return dateStr;
  }
}
