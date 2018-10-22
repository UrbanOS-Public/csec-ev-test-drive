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
  @Input() reservation = {day:null,vehicle:null,time:null};
  @Output() submit = new EventEmitter<any>();
  @Input() times;
  @Input() vehicles;
  days;
  helpers = new Helpers();

  constructor() { }

  ngOnInit() {
    console.log("Init", this.reservation);
  }

  ngOnChanges() {
    console.log("Change", this.reservation);
    if (this.times && this.times.length > 0) {
      this.getDays();
      this.getTimes();
      this.filterTimes();
    }
  }

  doSubmit() {
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
    console.log("Filtering");
    this.times = this.times.filter((time) => {
      return time.date == this.reservation.day;
    });
  }

}
