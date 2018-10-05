import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { EVService } from '../../common/ev.service';
import { ModalService } from '../../common/modal.service';

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

  constructor(
    private router: Router,
    private evService: EVService,
    private modalService: ModalService) {}

  ngOnInit() {
    this.doGetAnalytics();
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
    this.evService.getAnalytics("17043215").subscribe( //Fix this
      response => this.handleAnalytics(response),
      error => this.handleError(error)
    );
  }

  handleAnalytics(response) {
    console.log(response);
    this.sourceData = response;
    console.log(this.sourceData);
    this.modalService.close('pin-modal');
  }

  handleError(error) {
    this.showPinError = true;
    console.log(error);
  }
}
