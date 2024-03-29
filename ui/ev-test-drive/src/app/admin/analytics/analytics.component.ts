import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { EVService } from '../../common/ev.service';
import { ModalService } from '../../common/modal.service';
import * as globals from '../../app.constants';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit, AfterViewInit {

  isSubmitting = false;
  showPinError = false;
  sourceData = {};
  pin;

  links = globals.adminNavbar;

  constructor(
    private router: Router,
    private evService: EVService,
    private modalService: ModalService) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.openModal('pin-modal');
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
    this.router.navigateByUrl('/checkin');
  }

  doGetAnalytics() {
    this.isSubmitting = true;
    this.evService.getAnalytics(this.pin).subscribe(
      response => this.handleAnalytics(response),
      error => this.handlePinError(error)
    );
  }

  handleAnalytics(response) {
    this.sourceData = response;
    this.modalService.close('pin-modal');
  }
}
