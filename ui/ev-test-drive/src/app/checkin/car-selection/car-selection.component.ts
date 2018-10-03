import { Component, OnInit, HostListener } from '@angular/core';
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
  collapseCarTiles = false;
  carSlotId;
  day: any = moment().format('YYYY-MM-DD');

  constructor(
    private evService: EVService,
    private router: Router,
    private modalService: ModalService) {
      this.onResize();
    }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.collapseCarTiles = window.innerWidth <= 599;
  }

  ngOnInit() {
    if (localStorage.getItem('email')) {
      this.getCars();
      this.getTimes();
      this.preSelectCarAndTime();
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

  preSelectCarAndTime() {
    const preSelectCar = JSON.parse(localStorage.getItem('selectedCar'));
    const preSelectTime = JSON.parse(localStorage.getItem('selectedTime'));
  
    if (preSelectCar && preSelectTime) {
      this.doSelectTime(this.times.find((time) => time.date == preSelectTime.date && time.startTime == preSelectTime.startTime));
      this.doSelectCar(this.cars.find((car) => car.id == preSelectCar.id));
    }
  }

  doSelectTime(selectedTime) {
    if (!selectedTime || selectedTime.unavailable) {
      return;
    }
    const timeState = !selectedTime.selected;
    this.times.forEach((time) => {
      time.selected = false;
    });
    if (this.selectedTime != selectedTime) {
      this.selectedTime = selectedTime;
      this.selectedTime.selected = timeState;
    } else {
      this.selectedTime = null;
    }
    this.updateCarStatesForTime(this.selectedTime);
  }

  doSelectCar(selectedCar) {
    if (!selectedCar || selectedCar.unavailable) {
      return;
    }
    const carState = !selectedCar.selected;
    this.cars.forEach((car) => {
      car.selected = false;
    });
    if (this.selectedCar != selectedCar) {
      this.selectedCar = selectedCar;
      this.selectedCar.selected = carState;
    } else {
      this.selectedCar = null;
    }
    this.updateTimeStatesForCar(this.selectedCar);
    this.updateCarSlotId(this.selectedTime, selectedCar);
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
    } else {
      this.clearTimeAvailableStates();
    }
  }

  updateCarSlotId(time, car) {
    if(time){
      time.cars.forEach(carSlot => {
        if (carSlot.carId == car.id) {
          this.carSlotId = carSlot.carSlotId;
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

  doReset(){
    this.clearCarAvailableStates();
    this.clearTimeAvailableStates();
    this.clearSelectedStates(this.cars);
    this.clearSelectedStates(this.times);
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

  doSubmit() {
    if (!this.isSubmitting && this.selectedCar && this.selectedTime) {
      this.isSubmitting = true;
      localStorage.setItem('selectedCar', JSON.stringify(this.selectedCar));
      localStorage.setItem('selectedTime', JSON.stringify(this.selectedTime));
      localStorage.setItem('carSlotId', JSON.stringify(this.carSlotId));
      this.router.navigateByUrl('/checkin/carReview');
    }
  }

  openModal(id) {
    this.modalService.open(id);
  }

  closeModal(id) {
    this.modalService.close(id);
  }

  doCancel() {
    this.modalService.open('cancel-modal');
  }

  doCancelConfirm() {
    this.router.navigateByUrl('/checkin');
  }
}
