import { Component } from '@angular/core';
import { FormComponent } from '../form/form.component';

@Component({
  selector: 'text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss']
})
export class TextFieldComponent extends FormComponent {

  constructor() {
    super();
  }
}
