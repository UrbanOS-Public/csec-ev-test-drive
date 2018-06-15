import { Component, OnInit } from '@angular/core';
import { EVService } from '../../common/ev.service';
import { Helpers } from '../../app.helpers';

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
  selectedCar: string;
  selectedTime: string;
  formattedDate: string;

  constructor(private evService: EVService) { }

  ngOnInit() {
    this.getCars();
    this.formattedDate = this.formatDate(new Date());
  }

  getCars() {
    this.evService.getCars().subscribe(
      cars => this.initializeCars(cars),
      error => console.log(error)
    );
  }

  initializeCars(carArray) {
    this.cars = carArray;
    this.cars.forEach(car => {
      car.tileId = this.carCounter++;
    });
    this.getTimes();
  }

  getTimes() {
    this.evService.getTimeslots().subscribe(
      times => this.initializeTimeslots(times),
      error => console.log(error)
    );
  }

  initializeTimeslots(timesArray) {
    this.times = timesArray;
    this.times.forEach(time => {
      time.formattedTime = this.helpers.formatAMPM(time.startTime);
      time.tileId = this.timeCounter++;
    });
  }

  doSelectCar(carTileId) {
    const carList = document.getElementsByClassName("car-tile");
    const selectedTile = carList.item(carTileId);
    if (selectedTile.classList.contains("disabled")) {
      return;
    }

    for (let item of Array.from(carList)) {
      if (item.id == carTileId) {
        item.classList.toggle("selected");
      } else {
        item.classList.remove("selected");
      }
    }
  }

  doSelectTime(timeTileId) {
    const timeList = document.getElementsByClassName("time");
    const selectedTile = timeList.item(timeTileId);
    if (selectedTile.classList.contains("disabled")) {
      return;
    }

    for (let item of Array.from(timeList)) {
      if (item.id == timeTileId) {
        item.classList.toggle("selected");
      } else {
        item.classList.remove("selected");
      }
    }
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
