import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-adhoc-reservation',
  templateUrl: './adhoc-reservation.component.html',
  styleUrls: ['./adhoc-reservation.component.scss']
})
export class AdhocReservationComponent implements OnInit {
  registration = {
    firstName: null,
    lastName: null,
    email: null,
    zipcode: null
  };

  constructor() { }

  ngOnInit() {
  }

  doAdhoc() {
    console.log("registration info: ", this.registration);
  }

}
