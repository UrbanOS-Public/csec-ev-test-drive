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
  selectedCar: any;
  selectedTime: any;
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
      if (time.availableCount == 0 || time.formattedTime.substring(0,2) == "10") {
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
  }

  doSelectCar(carTileId) {
    const carList = document.getElementsByClassName("car-tile");
    const selectedTile = carList.item(carTileId);
    if (selectedTile.classList.contains("disabled")
       || selectedTile.classList.contains("unavailable")) {
      return;
    }

    for (let item of Array.from(carList)) {
      if (item.id == carTileId) {
        item.classList.toggle("selected");
        this.selectedCar = this.cars.filter(car => car.tileId === carTileId)[0];
      } else {
        item.classList.remove("selected");
      }
    }
  }

  doSelectTime(timeTileId) {
    const timeList = document.getElementsByClassName("time");
    const selectedTile = timeList.item(timeTileId);
    if (selectedTile.classList.contains("disabled")
       || selectedTile.classList.contains("unavailable")) {
      return;
    }

    for (let item of Array.from(timeList)) {
      if (item.id == timeTileId) {
        item.classList.toggle("selected");
        this.selectedTime = this.times.filter(time => time.tileId === timeTileId)[0];
        this.markUnavailableCars(this.selectedTime);
      } else {
        item.classList.remove("selected");
      }
    }
  }

  markUnavailableCars(time) {
    const carList = document.getElementsByClassName("car-tile");

    this.cars.forEach(car => {
      if (car.active) {
        let carElement = carList.item(car.tileId);

        if (car.times[time.formattedTime].reserved) {
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

        if (car.times[time.formattedTime].reserved) {
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
