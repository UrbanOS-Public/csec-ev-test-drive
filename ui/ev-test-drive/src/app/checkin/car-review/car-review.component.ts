import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EVService } from '../../common/ev.service';

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

  constructor(
    private router: Router,
    private evService: EVService) { }

  ngOnInit() {
    this.selectedCar = JSON.parse(localStorage.getItem('selectedCar'));
    this.selectedTime = JSON.parse(localStorage.getItem('selectedTime'));
    this.userEmail = localStorage.getItem('email');

    if (!this.selectedCar || !this.selectedTime || !this.userEmail) {
      this.router.navigateByUrl('/checkin');
    }
  }

  doSubmit() {
    this.isSubmitting = true;
    this.evService.getPreSurvey().subscribe(
      response => this.handleResponse(response),
      error => console.log(error)
    ); 
  }

  doCancel() {
    this.router.navigateByUrl('/checkin');
  }

  doEdit() {
    localStorage.removeItem('selectedCar');
    localStorage.removeItem('selectedTime');
    this.router.navigateByUrl('/checkin/carSelection');
  }

  handleResponse(response) {
    localStorage.setItem('preSurveyQuestions', JSON.stringify(response));
    this.router.navigateByUrl('/checkin/survey');
    
  }
}
