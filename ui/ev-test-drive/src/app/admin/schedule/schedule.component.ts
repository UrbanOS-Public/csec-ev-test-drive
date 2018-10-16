import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EVService } from '../../common/ev.service';
import { ModalService } from '../../common/modal.service';
import { Helpers } from '../../app.helpers';
import * as moment from 'moment';
import * as globals from '../../app.constants';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  schedule: any[] = [];
  formattedDate: string;
  helpers = new Helpers();
  isSubmitting = false;
  showPinError = false;
  scheduledDays: any[] = [];
  selectedSlot;
  pin;
  vehicles: any[] = [];

  links = globals.adminNavbar;

  constructor(
    private router: Router,
    private evService: EVService,
    private modalService: ModalService) { }

  ngOnInit() {
    this.loadSchedule();
    this.getVehicles();
  }

  loadSchedule() {
    this.isSubmitting = true;
    this.evService.getSchedule().subscribe(
      response => this.handleSchedule(response),
      error => this.handleError(error)
    );
  }

  getVehicles() {
    this.evService.getCars().subscribe(
      vehicles => this.handleVehicles(vehicles),
      error => this.handleError(error)
    );
  }

  handleVehicles(response) {
    this.vehicles = response.map((vehicle) => {
     return {
       id: vehicle.id,
       formattedName: vehicle.make + " " + vehicle.model
     }
    });
  }

  handleSchedule(response) {
    this.scheduledDays = [];

    this.formattedDate = this.formatDate(moment(response.date).toDate());
    this.schedule = response.schedules.sort((a, b) => {
      let aNum = Number(a.scheduled_start_time.substring(0, 2)
        + a.scheduled_start_time.substring(3, 5));
      let bNum = Number(b.scheduled_start_time.substring(0, 2)
        + b.scheduled_start_time.substring(3, 5));
      if (aNum > bNum) {
        return 1;
      } else if (aNum < bNum) {
        return -1;
      } else {
        return 0;
      }
    });
    this.schedule.forEach(slot => {
      slot.formattedTime = this.helpers.formatAMPM(slot.scheduled_start_time);
    });

    this.mapDays(this.schedule);
    this.isSubmitting = false;
    this.closeModal('pin-modal');
  }

  mapDays(schedule) {
    if (schedule && schedule.length > 0) {
      const unique = new Set(schedule.map(item => item.date));
      var days = Array.from(unique);
      days.sort();
      days.forEach((day: any) => {
        var timeSlotsForDay = schedule.filter((timeslot) => {
          return timeslot.date == day;
        });
        this.scheduledDays.push({ date: day, timeSlots: timeSlotsForDay });
      })
    }
  }

  handleLookupResponse(response) {
    if (response && response.email) {
      localStorage.setItem('email', response.email);
      this.evService.getPostSurvey().subscribe(
        surveyResponse => this.handleSurveyResponse(surveyResponse),
        error => this.handleError(error)
      );
    } else {
      this.handleError(null);
    }
  }

  handleSurveyResponse(response) {
    localStorage.setItem('postSurveyQuestions', JSON.stringify(response));
    this.isSubmitting = false;
    this.selectedSlot.isSubmitting = false;
    this.selectedSlot.checkingOut = false;
    this.router.navigateByUrl('/checkout/survey');
  }

  handleCancelRideResponse(response) {
    this.selectedSlot.isSubmitting = false;
    this.loadSchedule();
  }

  handleError(error) {
    this.selectedSlot.isSubmitting = false;
    this.openModal('error-modal');
  }

  handlePinError(error) {
    this.selectedSlot.isSubmitting = false;
    this.isSubmitting = false;
  }

  openModal(id) {
    this.showPinError = false;
    this.modalService.open(id);
  }

  closeModal(id) {
    this.showPinError = false;
    this.modalService.close(id);
  }

  doCancel(slot) {
    this.selectedSlot = slot;
    this.openModal('pin-modal');
  }

  doCancelRide() {
    this.selectedSlot.isSubmitting = true;
    const confirmationNumber = this.selectedSlot.confirmation_number;
    if (confirmationNumber) {
      this.evService.cancelRide(confirmationNumber, this.pin).subscribe(
        response => this.handleCancelRideResponse(response),
        error => this.handlePinError(error)
      );
    }
  }

  doCheckout(slot) {
    this.selectedSlot = slot;
    const confirmationNumber = this.selectedSlot.confirmation_number;
    this.selectedSlot.isSubmitting = true;
    this.selectedSlot.checkingOut = false;
    const lookupData = { confirmationNumber: confirmationNumber };
    localStorage.setItem('confirmationNumber', confirmationNumber);

    this.evService.lookupUser(lookupData).subscribe(
      response => this.handleLookupResponse(response),
      error => this.handleError(error)
    );
  }

  formatDate(date: any) {
    date = moment(date, 'YYYY-MM-DD');
    const today = moment();
    let dateStr = '';

    if (today.month() === date.month()
      && today.date() === date.date()
      && today.year() === date.year()) {
      dateStr += 'Today, ';
    } else {
      dateStr += `${date.format('ddd')}, `;
    }

    dateStr += `${date.format('MMM')} ${date.date()}, ${date.year()}`;

    return dateStr;
  }
}
