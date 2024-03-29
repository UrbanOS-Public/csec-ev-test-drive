import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EVService } from '../../common/ev.service';
import { ModalService } from '../../common/modal.service';
import { Helpers } from '../../app.helpers';
import * as moment from 'moment';
import * as globals from '../../app.constants';
import _ from 'underscore';

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
  pastScheduledDays = [];
  upcomingScheduledDays = [];
  links = globals.adminNavbar;
  timeSlots = [];
  days;
  selectedReservation = {day:null,vehicle:null,time:null,confirmationNumber:null,carSlotId:null};
  doPinConfirm;
  surveySummary;

  constructor(
    private router: Router,
    private evService: EVService,
    private modalService: ModalService) { }

  ngOnInit() {
    this.getVehicles();
    this.getSurveySummaryData();
  }

  loadSchedule() {
    let startOfYear = new Date(2018, 1, 1);
    this.isSubmitting = true;
    this.evService.getSchedule(startOfYear).subscribe(
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

  getSurveySummaryData() {
    this.evService.getSurveySummary().subscribe(
      surveyResults => this.handleSurveySummaryResponse(surveyResults),
      error => this.handleError(error)
    );
  }

  handleSurveySummaryResponse(response) {
    this.surveySummary = response;
    this.loadSchedule();
  }

  handleVehicles(response) {
    this.vehicles = response.map((vehicle) => {
      return {
        id: vehicle.id,
        formattedName: vehicle.make + " " + vehicle.model,
        active:vehicle.active
      }
    });
  }

  handleSchedule(response) {
    this.scheduledDays = [];
    this.pastScheduledDays = [];
    this.upcomingScheduledDays = [];

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
      slot.tookPostSurvey = this.surveySummary.find(summary => summary.confirmation_number == slot.confirmation_number) != undefined;
    });

    this.mapDays(this.schedule);
    this.pastScheduledDays = _.sortBy(this.pastScheduledDays, 'date').reverse();
    this.isSubmitting = false;
    this.closeModal('pin-modal');
  }

  mapDays(schedule) {
    const today = moment().startOf('day').format('YYYY-MM-DD');

    if (schedule && schedule.length > 0) {
      const unique = new Set(schedule.map(item => item.date));
      var days = Array.from(unique);
      days.sort();
      days.forEach((day: any) => {
        var timeSlotsForDay = schedule.filter((timeslot) => {
          return timeslot.date == day;
        });

        let diffFromToday = moment(day).diff(today, 'days');
        let scheduleByDate = { date: day, timeSlots: timeSlotsForDay }

        diffFromToday >= 0 ? this.upcomingScheduledDays.push(scheduleByDate) :
          this.pastScheduledDays.push(scheduleByDate)
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
    if (this.selectedSlot) {
      this.selectedSlot.isSubmitting = false;
    }
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

  doCancel(slot) {
    this.selectedSlot = slot;
    this.doPinConfirm = this.doCancelRide;
    this.openModal('pin-modal');
  }

  doEditReservation(reservation) {
    if(reservation.day == null) {
      return;
    }
    this.selectedReservation = reservation;
    this.doPinConfirm = this.doEditRide;
    this.openModal('pin-modal');
  }

  doEditRide() {
    this.evService.postEditRide({...this.selectedReservation, pin:this.pin}).subscribe(
      response => this.handleEditRideResponse(response),
      error => this.handlePinError(error)
    );
  }

  doEdit(slot) {
    const editingState = !slot.editing;
    this.schedule.forEach(schedule => schedule.editing = false);
    slot.editing = editingState;
    slot.preLoading = true;
    this.selectedReservation.day = moment.utc(slot.date).format('YYYY-MM-DD');
    this.selectedReservation.time = slot.scheduled_start_time;
    this.selectedReservation.vehicle = slot.carId;
    this.selectedReservation.confirmationNumber = slot.confirmation_number;
    this.evService.getTimeslots().subscribe(
      times => this.handleTimeSlotsResponse(times, slot),
      error => this.handleError(error)
    );
  }

  handleTimeSlotsResponse(response, slot) {
    this.timeSlots = response;
    slot.preLoading = false;
  }

  handleEditRideResponse(response){
    let drive = this.schedule.find(drive => drive.confirmation_number == this.selectedReservation.confirmationNumber);
    if (drive) {
      drive.editing = false;
    }
    this.loadSchedule();
    this.selectedReservation = {day:null,vehicle:null,time:null,confirmationNumber:null,carSlotId:null};
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
    if (slot.tookPostSurvey){
      return;
    }
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

  gotoTop() {
    window.scrollTo(0,0);
  }
}
