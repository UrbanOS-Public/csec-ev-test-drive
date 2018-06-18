import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Helpers } from '../../app.helpers';
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
    private evService: EVService,
    private router: Router) { }

  ngOnInit() {
    localStorage.clear();
  }

  doCancel() {
    this.router.navigateByUrl('/checkin');
  }

  doSubmit() {
    this.formSubmitted = true;
    if (this.applicationForm.valid) {
      this.submitApplication();
    }
  }

  private submitApplication() {
    const data = this.applicationForm.value;

    this.evService.postNewUser(data).subscribe(
      response => this.handleResponse(response), 
      error => this.handleError(error)
    );
  }

  private handleResponse(response) {
    if (response && response.message === "Success") {
      localStorage.setItem('email', this.applicationForm.value.email);
      this.router.navigateByUrl('/checkin/carSelection');
    } else {
      this.handleError(null);
    }
  }

  private handleError(error) {
    this.router.navigateByUrl('/checkin');
  }
}
