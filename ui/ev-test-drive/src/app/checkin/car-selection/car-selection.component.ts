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
  selectedCar: any;
  selectedTime: any;
  formattedDate: string;
  isSubmitting = false;

  constructor(
    private evService: EVService,
    private router: Router,
    private modalService: ModalService) { }

  ngOnInit() {
    if (localStorage.getItem('email')) {
      this.getCars();
    } else {
      this.router.navigateByUrl('/checkin');
    }
  }

  ngAfterViewInit() {
    if (this.selectedCar && this.selectedTime) {

      // Select asynchronously to avoid conflicts with change detection
      setTimeout(() => {
        this.doSelectCar(this.selectedCar.tileId);
        this.doSelectTime(this.selectedTime.tileId);
      });
    }
  }

  getCars() {
    this.initializeCars(JSON.parse(localStorage.getItem('cars')));
  }

  initializeCars(carArray) {
    this.carCounter = 0;
    carArray.forEach(car => {
      if (car.active) {
        car.tileId = this.carCounter++;
        car.times = {};
        this.cars.push(car);
      }
    });
    this.getTimes();
  }

  getTimes() {
    this.initializeTimeslots(JSON.parse(localStorage.getItem('times')));
  }

  initializeTimeslots(timesArray) {
    this.times = timesArray;
    this.timeCounter = 0;

    this.toggleDateDisplay();

    this.times.forEach(time => {
      time.formattedTime = this.helpers.formatAMPM(time.startTime);
      time.tileId = this.timeCounter++;
      time.formattedDate = this.formattedDate;
      if (time.availableCount == 0) {
        time.disabled = true;
      }
      time.cars.forEach(timeCar => {
        let car = this.cars.filter(c => c.id == timeCar.carId)[0];
        car.times[time.formattedTime] = {
          timeSlotId: timeCar.carSlotId,
          timeTileId: time.tileId,
          reserved: timeCar.reserved
        };
      });
    });

    this.preSelectCarAndTime();
  }

  toggleDateDisplay() {
    const dateElement = document.getElementsByClassName('date').item(0);
    const noRidesElement = document.getElementsByClassName('no-rides').item(0);

    if (this.times.length === 0) {
      if (dateElement) {
        dateElement.classList.add('hidden');
      }
      if (noRidesElement) {
        noRidesElement.classList.remove('hidden');
      }
    } else {
      if (dateElement) {
        dateElement.classList.remove('hidden');
      }
      if (noRidesElement) {
        noRidesElement.classList.add('hidden');
      }
      this.formattedDate = this.formatDate(moment(this.times[0].date).toDate());
    }
  }

  preSelectCarAndTime() {
    const carStr = localStorage.getItem('selectedCar');
    const timeStr = localStorage.getItem('selectedTime');

    if (carStr && timeStr) {
      this.selectedCar = JSON.parse(carStr);
      this.selectedTime = JSON.parse(timeStr);
    }
  }

  doReset() {
    this.doSelectCar(-1);
    this.doSelectTime(-1);
  }

  doSubmit() {
    if (!this.isSubmitting && this.selectedCar && this.selectedTime) {
      this.isSubmitting = true;
      localStorage.setItem('selectedCar', JSON.stringify(this.selectedCar));
      localStorage.setItem('selectedTime', JSON.stringify(this.selectedTime));
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

  doSelectCar(carTileId) {
    const carList = document.getElementsByClassName("car-tile");
    const selectedTile = carList.item(carTileId);
    if (selectedTile && selectedTile.classList.contains("disabled")
       || selectedTile && selectedTile.classList.contains("unavailable")) {
      return;
    }

    this.selectedCar = null;
    for (let item of Array.from(carList)) {
      if (item.id == carTileId) {
        if (item.classList.contains("selected")) {
          item.classList.remove("selected");
          this.selectedCar = null;
        } else {
          item.classList.add("selected");
          this.selectedCar = this.cars.filter(car => car.tileId === carTileId)[0];
        }
      } else {
        item.classList.remove("selected");
      }
    }
    this.markUnavailableTimes(this.selectedCar);
  }

  doSelectTime(timeTileId) {
    const timeList = document.getElementsByClassName("time");
    const selectedTile = timeList.item(timeTileId);
    if (selectedTile && selectedTile.classList.contains("disabled")
       || selectedTile && selectedTile.classList.contains("unavailable")) {
      return;
    }

    this.selectedTime = null;
    for (let item of Array.from(timeList)) {
      if (item.id == timeTileId) {
        if (item.classList.contains("selected")) {
          item.classList.remove("selected");
          this.selectedTime = null;
        } else {
          item.classList.add("selected");
          this.selectedTime = this.times.filter(time => time.tileId === timeTileId)[0];
        }
      } else {
        item.classList.remove("selected");
      }
    }
    this.markUnavailableCars(this.selectedTime);
  }

  markUnavailableCars(time) {
    const carList = document.getElementsByClassName("car-tile");

    this.cars.forEach(car => {
      if (car.active) {
        let carElement = carList.item(car.tileId);

        if (time && car.times[time.formattedTime].reserved) {
          carElement.classList.add("unavailable");
          carElement.classList.remove("selected");
        } else {
          carElement.classList.remove("unavailable");
        }
      } 
    });
  }

  markUnavailableTimes(car) {
    const timeList = document.getElementsByClassName("time");

    this.times.forEach(time => {
      if (time.availableCount > 0) {
        let timeElement = timeList.item(time.tileId);

        if (car && car.times[time.formattedTime].reserved) {
          timeElement.classList.add("unavailable");
          timeElement.classList.remove("selected");
        } else {
          timeElement.classList.remove("unavailable");
        }
      } 
    });
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
