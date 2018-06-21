import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Helpers } from '../../app.helpers';
import { EVService } from '../../common/ev.service';

@Component({
  selector: 'app-checkout-welcome',
  templateUrl: './checkout-welcome.component.html',
  styleUrls: ['./checkout-welcome.component.scss']
})
export class CheckoutWelcomeComponent implements OnInit {

  loginForm: FormGroup = this.formBuilder.group({});
  formData: any;
  helpers = new Helpers();
  formSubmitted: boolean = false;
 

  constructor(
    private formBuilder: FormBuilder,
    private evService: EVService,
    private router: Router) {}

  ngOnInit() {
    localStorage.clear();
  }

  formValid() {
    return this.loginForm.valid && 
      (this.loginForm.value.email || this.loginForm.value.confirmationNumber);
  }

  doSubmit() {
    this.formSubmitted = true;
    if (this.loginForm.valid) {
      this.submitApplication();
    }
  }

  private submitApplication() {
    const data = this.loginForm.value;

    let submitData: any = {};
    if (data.email) {
      submitData.email = data.email;
    } else {
      submitData.confirmationNumber = data.confirmationNumber;
    }

    this.evService.lookupUser(submitData).subscribe(
      response => this.handleResponse(response), 
      error => this.handleError(error)
    );
  }

  private handleResponse(response) {
    if (response && response.email) {
      localStorage.setItem('email', response.email);
      this.evService.getPostSurvey().subscribe(
        surveyResponse => this.handleSurveyResponse(surveyResponse),
        error => this.handleError(error)
      );
    } else {
      this.handleError(null);
    }
  }

  private handleSurveyResponse(response) {
    localStorage.setItem('postSurveyQuestions', JSON.stringify(response));
    this.router.navigateByUrl('/checkout/survey');
  }

  private handleError(error) {
    this.formSubmitted = false;
    document.getElementById('error').classList.remove('hidden');
    this.router.navigateByUrl('/checkout');
  }
}
