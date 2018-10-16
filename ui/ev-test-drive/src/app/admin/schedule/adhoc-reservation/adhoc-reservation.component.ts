import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment'

@Component({
  selector: 'app-adhoc-reservation',
  templateUrl: './adhoc-reservation.component.html',
  styleUrls: ['./adhoc-reservation.component.scss']
})
export class AdhocReservationComponent implements OnInit {
  @Input() vehicles

  selectedVehicle = ""
  registration = {
    firstName: null,
    lastName: null,
    email: null,
    zipcode: null
  };

  reservation = {
    date: null,
    time: null
  }

  constructor() { }

  ngOnInit() {

  }

  transformAdhocData(){
    return {
      vehicle: this.selectedVehicle,
      driver: this.registration,
      dateScheduled: this.transformDateTime()
    }
  }

  transformDateTime() {
    let {date, time } = this.reservation;

    return {
      formattedDate: date.format('YYYY-MM-DD'),
      formattedTime: time
    }
  }

  doAdhoc() {
    console.log('make api call with data', this.transformAdhocData())
  }




}
