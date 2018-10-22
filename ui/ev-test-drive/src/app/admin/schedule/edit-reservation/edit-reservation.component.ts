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
  @Input() vehicles;
  filteredTimes;
  days;
  helpers = new Helpers();
  isSubmitting = false;

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges() {
    if (this.times && this.times.length > 0) {
      this.getDays();
      this.getTimes();
      this.filterTimes();
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

}
