import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EVService } from '../../common/ev.service';
import { ModalService } from '../../common/modal.service';

@Component({
  selector: 'app-car-review',
  templateUrl: './car-review.component.html',
  styleUrls: ['./car-review.component.scss']
})
export class CarReviewComponent implements OnInit {

  selectedCar: any;
  selectedTime: any;
  userEmail: string;
  isSubmitting = false;
  carSlotId: number;

  constructor(
    private router: Router,
    private evService: EVService,
    private modalService: ModalService) { }

  ngOnInit() {
    this.selectedCar = JSON.parse(localStorage.getItem('selectedCar'));
    this.selectedTime = JSON.parse(localStorage.getItem('selectedTime'));
    this.userEmail = localStorage.getItem('email');
    this.carSlotId = JSON.parse(localStorage.getItem('carSlotId'));

    if (!this.selectedCar || !this.selectedTime || !this.userEmail) {
      this.router.navigateByUrl('/checkin');
    }
  }

  doSubmit() {
    this.isSubmitting = true;
    
    if (localStorage.getItem('skipPreSurvey') === 'true') {

      const scheduleDriveData = {
        email: this.userEmail,
        carSlotId: this.carSlotId,
        passengers: localStorage.getItem('passengers')
      };

      this.evService.postReserveSlot({carSlotId:this.carSlotId, email: this.userEmail }).subscribe(
        response => {
          this.evService.postScheduleDrive(scheduleDriveData).subscribe(
            response => this.handleScheduleDrivePostResponse(response),
            error => this.handleError(error)
          );
        },
        error => this.handleError(error)
      );
      
    } else {
      this.evService.postReserveSlot({carSlotId:this.carSlotId, email: this.userEmail }).subscribe(
        response => {},
        error => this.handleError(error)
      );
      this.evService.getPreSurvey().subscribe(
        response => this.handleSurveyResponse(response),
        error => this.handleError(error)
      );
    }
  }

  openModal(id) {
    this.modalService.open(id);
  }

  closeModal(id) {
    this.modalService.close(id);
  }

  doCancel() {
    this.modalService.open('cancel-modal');
  }

  doCancelConfirm() {
    this.evService.postReleaseSlot({carSlotId:this.carSlotId}).subscribe(
      response => this.router.navigateByUrl('/checkin'),
      error => this.handleError(console.log(error))
    );
  }

  doEdit() {
    this.router.navigateByUrl('/checkin/carSelection');
  }

  handleSurveyResponse(response) {
    localStorage.setItem('preSurveyQuestions', JSON.stringify(response));
    this.router.navigateByUrl('/checkin/survey');
  }

  handleScheduleDrivePostResponse(response) {
    if (response.confirmation_number) {
      localStorage.setItem('confirmationNumber', response.confirmation_number);
      this.router.navigateByUrl('/checkin/carConfirm');
    } else {
      this.handleError("no confirmation number!");
    }
  }

  handleError(error) {
    this.isSubmitting = false;
    this.openModal('error-modal');
  }
}
