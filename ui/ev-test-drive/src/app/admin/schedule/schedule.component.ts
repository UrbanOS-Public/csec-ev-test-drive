import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EVService } from '../../common/ev.service';
import { ModalService } from '../../common/modal.service';
import { Helpers } from '../../app.helpers';
import * as moment from 'moment';

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

  constructor(
    private router: Router,
    private evService: EVService,
    private modalService: ModalService) { }

  ngOnInit() {
    this.loadSchedule();
  }

  loadSchedule() {
    this.isSubmitting = true;
    this.evService.getSchedule().subscribe(
      response => this.handleSchedule(response),
      error => this.handleError(error)
    );
  }

  handleSchedule(response) {
    this.formattedDate = this.formatDate(moment(response.date).toDate());
    this.schedule = response.schedules.sort((a, b) => {
      let aNum = Number(a.scheduled_start_time.substring(0,2)
                        + a.scheduled_start_time.substring(3,5));
      let bNum = Number(b.scheduled_start_time.substring(0,2)
                        + b.scheduled_start_time.substring(3,5));
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
    this.isSubmitting = false;
    this.closeModal('pin-modal');
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
    this.router.navigateByUrl('/checkout/survey');
  }

  handleCancelRideResponse(response) {
    this.loadSchedule(); 
  }

  handleError(error) {
    this.isSubmitting = false;
    this.openModal('error-modal');
  }

  handlePinError(error) {
    this.showPinError = true;
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

  doCancel(confirmationNumber) {
    localStorage.setItem('cancelConfirmationNumber', confirmationNumber);
    this.toggleMorePane(confirmationNumber);
    this.openModal('pin-modal');
  }

  doCancelRide() {
    const confirmationNumber = localStorage.getItem('cancelConfirmationNumber');
    const pinPane = document.getElementsByClassName('pin-pane').item(0);
    const pinInput = <HTMLInputElement>(pinPane.getElementsByClassName('pin').item(0));
    const pin = (pinInput ? pinInput.value : 0) || 0;

    this.isSubmitting = true;
    if (pinInput) {
      pinInput.value = "";
    }

    if (confirmationNumber) {
      this.evService.cancelRide(confirmationNumber, pin).subscribe(
        response => this.handleCancelRideResponse(response),
        error => this.handlePinError(error)
      );
    }
  }

  doCheckout(confirmationNumber) {
    const lookupData = { confirmationNumber: confirmationNumber };
    localStorage.setItem('confirmationNumber', confirmationNumber);
    this.isSubmitting = true;

    this.evService.lookupUser(lookupData).subscribe(
      response => this.handleLookupResponse(response),
      error => this.handleError(error)
    );
  }

  toggleMorePane(confirmationNumber) {
    const driverInfoPane = document.getElementById(confirmationNumber);
    const morePane = driverInfoPane.getElementsByClassName('more-pane').item(0);

    if (morePane) {
      morePane.classList.toggle('open');
    }
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
      dateStr;
    }

    dateStr += `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

    return dateStr;
  }
}
