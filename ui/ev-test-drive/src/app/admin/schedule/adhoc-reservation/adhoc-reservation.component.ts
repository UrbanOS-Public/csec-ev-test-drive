import { Component, OnInit, Input } from '@angular/core';
import { EVService } from '../../../common/ev.service';
import * as moment from 'moment';

@Component({
  selector: 'app-adhoc-reservation',
  templateUrl: './adhoc-reservation.component.html',
  styleUrls: ['./adhoc-reservation.component.scss']
})
export class AdhocReservationComponent implements OnInit {
  @Input() vehicles

  firstName;
  lastName;
  email;
  zip;
  phone;
  selectedVehicle;
  date;
  startTime;
  endTime;
  maxDate = new Date();
  minDate = new Date(2018, 1, 1);

  constructor(private evService: EVService) { }

  ngOnInit() {}

  submitUser() {
    const driver = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      zip: this.zip.toString(),
      phone: this.phone
    }

    this.evService.postNewUser(driver).subscribe(
      response => this.handleResponse(response),
      error => this.handleError(error)
    );
  }

  buildDateTime() {
    let dateTimeString = this.date.format('YYYY-MM-DD').concat(this.startTime);
    let dateTimeMoment = moment(dateTimeString, 'YYYY-MM-DDhh:mm a');

    return dateTimeMoment;
  }

  buildDriveInfo(dateTime) {
    return {
      email: this.email,
      selectedCar: {
        id: this.selectedVehicle.id
      },
      reservation: {
        date: dateTime.format('YYYY-MM-DD'),
        start_time: dateTime.format('HH:mm'),
        end_time: dateTime.add(30, 'minutes').format('HH:mm')
      }
    }
  }

  handleResponse(response) {
    if (response && response.email) {
      localStorage.setItem('email', response.email);
    } else {
      this.handleError(null);
    }

    const dateTimeMoment = this.buildDateTime();
    const driveRequestObject = this.buildDriveInfo(dateTimeMoment);

    this.evService.postScheduleAdhocDrive(driveRequestObject).subscribe(
      reservation => this.handleAdhocDrive(reservation),
      error => this.handleError(error)
    );
  }

  handleAdhocDrive(response) {
    if (response.confirmation_number) {
      localStorage.setItem('confirmationNumber', response.confirmation_number);
    } else {
      this.handleError("no confirmation number!");
    }
  }

  handleError(error) {
    console.log('an error occurred', error);
  }

  doAdhoc() {
    this.submitUser();
  }
}