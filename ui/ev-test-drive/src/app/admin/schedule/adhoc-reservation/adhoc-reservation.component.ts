import { Component, OnInit, Input } from '@angular/core';
import { EVService } from '../../../common/ev.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ModalService } from '../../../common/modal.service';

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
  isSubmitting = false;
  pin;
  showPinError = false;

  constructor(
    private evService: EVService,
    private router: Router,
    private modalService: ModalService) { }

  ngOnInit() {}

  submitUser() {
    const driver = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      zip: this.zip.toString(),
      phone: this.phone
    }

    this.isSubmitting = true;

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
      },
      pin: this.pin
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
      error => this.handlePinError(error)
    );
  }

  handleSurveyResponse(response) {
    this.isSubmitting = false;
    localStorage.setItem('preSurveyQuestions', JSON.stringify(response));
    this.router.navigateByUrl('/checkin/survey');
  }

  handleAdhocDrive(response) {
    if (response.confirmation_number) {
      localStorage.setItem('confirmationNumber', response.confirmation_number);
      localStorage.setItem('adhocReservation', 'true');

      this.evService.getPreSurvey().subscribe(
        response => this.handleSurveyResponse(response),
        error => this.handlePinError(error)
      );

    } else {
      this.handleError("no confirmation number!");
    }
  }

  handleError(error) {
    this.isSubmitting = false;
    console.log('an error occurred', error);
  }

  doAdhoc() {
    this.openModal('adhoc-pin-modal');
  }

  handlePinError(error) {
    this.isSubmitting = false;
    this.showPinError = true;
  }

  openModal(id) {
    this.showPinError = false;
    this.modalService.open(id);
  }

  closeModal(id) {
    this.showPinError = false;
    this.modalService.close(id);
  }
}
