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
  days: any[] = [];
  allTimes: any;
  selectedCar: any;
  selectedTime: any;
  selectedDay: any;
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
      if (!this.cars || !this.times) {
        this.router.navigateByUrl('/checkin');
      }
    } else {
      this.router.navigateByUrl('/checkin');
    }
  }

  getCars() {
    this.cars = JSON.parse(localStorage.getItem('cars'));
  }

  getTimes() {
    this.allTimes = JSON.parse(localStorage.getItem('times'));
    this.allTimes.forEach((time) => {
      time.formattedTime = this.helpers.formatAMPM(time.startTime);
      if (time.startTime <= moment().format('HH:mm:ss') && time.date == moment().format('YYYY-MM-DD')) {
        time.hidden = true;
      }
    });
    this.getDays();
    this.selectedDay = this.days[0];
    this.showTimesForDay(this.selectedDay)
  }
  
  getDays() {
    const unique = new Set(this.allTimes.map(item => item.date));
    this.days = Array.from(unique);
  }

  showTimesForDay(day) {
    this.times = this.allTimes.filter((time) => {
      return time.date == day;
    });
  }

  doDaySelect() {
    this.showTimesForDay(this.selectedDay);
    this.doReset();
  }

  preSelectCarAndTime() {
    const preSelectCar = JSON.parse(localStorage.getItem('selectedCar'));
    const preSelectTime = JSON.parse(localStorage.getItem('selectedTime'));
  
    if (preSelectCar && preSelectTime) {
      this.doSelectTime(this.times.find((time) => time.date == preSelectTime.date && time.startTime == preSelectTime.startTime));
      this.doSelectCar(this.cars.find((car) => car.id == preSelectCar.id));
      this.selectedDay = this.days.find((day) => day == preSelectTime.date);
      this.showTimesForDay(this.selectedDay);
    }
  }

  doSelectTime(selectedTime) {
    if (!selectedTime || selectedTime.disabled || selectedTime.availableCount <= 0) {
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
    this.updateCarSlotId(this.selectedTime, this.selectedCar);
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

  updateCarSlotId(time, car) {
    if(time && car){
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

  formatDate(date: any) {
    date = moment(date);
    const today = moment();
    let dateStr = '';
    
    if (today.month() === date.month()
     && today.date() === date.date()
     && today.year() === date.year()) {
      dateStr += 'Today, ';
    } else {
      dateStr += `${date.format('ddd')}, `;
    }

    dateStr += `${date.format('MMM')} ${date.date()}, ${date.year()}`;

    return dateStr;
  }

  doSubmit() {
    if (!this.isSubmitting && this.selectedCar && this.selectedTime && this.carSlotId) {
      this.isSubmitting = true;
      this.selectedTime.formattedDate = this.formatDate(this.selectedTime.date);
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
