import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-car-confirm',
  templateUrl: './car-confirm.component.html',
  styleUrls: ['./car-confirm.component.scss']
})
export class CarConfirmComponent implements OnInit {

  selectedCar: any;
  selectedTime: any;

  constructor(
    private router: Router) { }

  ngOnInit() {
    this.selectedCar = JSON.parse(localStorage.getItem('selectedCar'));
    localStorage.removeItem('selectedCar')
    this.selectedTime = JSON.parse(localStorage.getItem('selectedTime'));
    localStorage.removeItem('selectedTime')
    const confirmationCode = localStorage.getItem('confirmationNumber');

    if (!this.selectedCar || !this.selectedTime || !confirmationCode) {
      this.router.navigateByUrl('/checkin');
    }
  }

  doClose() {
    this.router.navigateByUrl('/checkin');
  }
}
