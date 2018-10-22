import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { surveySubmitUrl } from 'src/app/app.constants';

@Component({
  selector: 'app-edit-reservation',
  templateUrl: './edit-reservation.component.html',
  styleUrls: ['./edit-reservation.component.scss']
})
export class EditReservationComponent implements OnInit {
  @Input() reservation = {day:null,vehicle:null,time:null};
  @Output() submit = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  doSubmit() {
    this.submit.emit({...this.reservation});
  }

}
