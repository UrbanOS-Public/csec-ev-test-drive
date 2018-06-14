import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Helpers } from '../../app.helpers';

@Component({
  selector: 'form-component',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  @Input() type: string;
  @Input() question: string;
  @Input() questionId: string;
  @Input() required: boolean;
  @Input() formSubmitted: boolean;
  @Input() group: FormGroup;
  helpers: Helpers = new Helpers();

  constructor() { }

  ngOnInit() {
    this.group.addControl(this.questionId, new FormControl('', this.helpers.getValidators(this.required, this.type)));
  }

  hasDanger() {
    if (this.isEmpty()) {
      return this.isInvalid();
    } else {
      return false;
    }
  }

  hasWarning() {
    if (this.isEmpty()) {
      return false;
    } else {
      return this.isInvalid();
    }
  }

  isEmpty() {
    return this.group.controls[this.questionId].value === '';
  }

  isInvalid() {
    let input = this.group.controls[this.questionId];
    if (this.formSubmitted) {
      return input.invalid;
    } else {
      return input.invalid && input.touched;
    }
  }
}
