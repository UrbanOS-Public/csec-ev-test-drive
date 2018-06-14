import { Component } from '@angular/core';
import { FormComponent } from '../form/form.component';

@Component({
  selector: 'text-box',
  templateUrl: './text-box.component.html',
  styleUrls: ['./text-box.component.scss']
})
export class TextBoxComponent extends FormComponent {

  constructor() {
    super();
  }
}
