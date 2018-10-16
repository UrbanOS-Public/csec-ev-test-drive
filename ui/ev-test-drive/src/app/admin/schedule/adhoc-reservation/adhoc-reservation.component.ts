import { Component, OnInit, Input } from '@angular/core';
import { EVService } from '../../../common/ev.service';

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
    zip: null,
    phone: null
  };

  reservation = {
    date: null,
    start_time: null,
    end_time: null
  }

  constructor(private evService: EVService) { }

  ngOnInit() {

  }

  transformAdhocData() {
    this.transformRegistrationData()

    return {
      selectedVehicle: this.selectedVehicle,
      userData: this.registration,
      reservation: this.transformDateTime()
    }
  }

  transformRegistrationData() {
    this.registration.zip = this.registration.zip.toString();
  }

  transformDateTime() {
    let { date, start_time, end_time } = this.reservation;

    return {
      formattedDate: date.format('YYYY-MM-DD'),
      formattedTime: start_time
    }
  }

  submitUser() {
    const driver = this.registration;

    this.evService.postNewUser(driver).subscribe(
      response => this.handleResponse(response),
      error => this.handleError(error)
    );
  }

  handleResponse(response) {
    console.log('successfully saved email to local storage')
    if (response && response.email) {
      localStorage.setItem('email', this.registration.email);
    } else {
      this.handleError(null);
    }

    const scheduleDriveData = {
      email: 'stubemail@test.com',
      selectedCar: { id: 1},
      reservation: {
        date: '2018-09-11',
        start_time: '01:00:00',
        end_time: '01:30:00'
      }
    };

    const testing = {
      "email": "test1@test.com",
      "selectedCar": {
        "id": 1
      },
      "reservation": {
        "date": "2018-09-11",
        "start_time": "01:00:00",
        "end_time": "01:30:00"
      }
    }

    this.evService.postScheduleAdhocDrive(testing).subscribe(
      reservation => this.handleAdhocDrive(reservation),
      error => this.handleError(error)
    );
  }

  handleAdhocDrive(reservation) {
    console.log('reservation was created', reservation);
  }

  handleError(error) {
    console.log('an error occurred', error);
  }

  doAdhoc() {
    console.log('make api call with data', this.transformAdhocData())
    this.submitUser();
  }




}
