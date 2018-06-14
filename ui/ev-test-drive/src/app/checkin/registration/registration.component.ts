import { Component, OnInit } from '@angular/core';
import { Helpers } from '../../app.helpers';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EVService } from '../../common/ev.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  applicationForm: FormGroup = this.formBuilder.group({});
  formData: any;
  helpers = new Helpers();
  formSubmitted: boolean = false;
  submitApplicationFailed: boolean = false;
  submitApplicationSuccessful: boolean = false;    

  constructor(
    private formBuilder: FormBuilder,
    private evService: EVService) { }

  ngOnInit() {
  }

  doCancel() {
    console.log("Cancelled!");
  }

  doSubmit() {
    this.formSubmitted = true;
    if (this.applicationForm.valid) {
      this.submitApplication();
    }
  }

  private submitApplication() {
    const data = this.applicationForm.value;

    console.log(data);

    this.evService.postNewUser(data).subscribe(
      response => console.log(response),
      error => console.log(error)
    );
  }
}
