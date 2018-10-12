import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { surveySubmitUrl } from 'src/app/app.constants';

@Component({
  selector: 'app-exception-form',
  templateUrl: './exception-form.component.html',
  styleUrls: ['./exception-form.component.scss']
})
export class ExceptionFormComponent implements OnInit {
  @Output() submit = new EventEmitter<any>();
  @Input() isSubmitting = false;

  exception = {date:null};
  
  constructor() { }

  ngOnInit() {
  }

}
