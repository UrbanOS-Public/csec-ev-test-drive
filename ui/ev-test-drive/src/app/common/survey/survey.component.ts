import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { EVService } from '../../common/ev.service';
import { ModalService } from '../../common/modal.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {

  nextVisible = false;
  textVisible = false;
  questionHeaderText: string;
  showQuestionText = true;
  questions: any[] = [];
  surveyId: number;
  questionGroupId: number;
  surveyType: string;
  pageId = 0;
  pageDisplayId = 0;
  totalQuestions = 0;
  sliderValues: string[] = [];
  sliderTextLow: string;
  sliderTextHigh: string;
  baseModule: string;
  isSubmitting = false;
  carSlotId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private evService: EVService,
    private modalService: ModalService) { }

  ngOnInit() {
    this.determineQuestionFromRoute();
  }

  determineQuestionFromRoute() {
    const url = this.router.url;
    this.surveyType = url.indexOf('checkin') >= 0 ? 'pre' : 'post';
    this.baseModule = url.indexOf('checkin') >= 0 ? '/checkin' : '/checkout';
    const surveyObject = JSON.parse(localStorage.getItem(
      this.surveyType + 'SurveyQuestions'));

    if (!surveyObject) {
      console.log("No survey object found!");
      this.router.navigateByUrl(this.baseModule);
    } else {

      this.route.params.subscribe(
        params => {
          if ( !params['questionId']) {
            this.router.navigateByUrl(this.router.url + '/1');
          } else {
            this.pageId = Number(params['questionId']) - 1;
            const questionGroup = surveyObject.question_groups.find(group => {
              return group.order_index == this.pageId;
            });

            if (questionGroup) {
              this.pageDisplayId = Number(this.pageId) + 1;
              this.surveyId = surveyObject.id;
              this.questionGroupId = questionGroup.id;
              this.questions = questionGroup.surveyQuestions;
              this.questionHeaderText = questionGroup.text || this.questions[0].text;
              this.showQuestionText = questionGroup.text ? true : false;
              this.totalQuestions = surveyObject.question_groups.length;
              this.sliderTextLow = questionGroup.scale_text_low;
              this.sliderTextHigh = questionGroup.scale_text_high;

              const question1 = questionGroup.surveyQuestions[0];
              this.nextVisible = question1.type !== 'MC';
            } else {
              console.log("Can't find question group!");
              this.location.back();
            }
          }
        }
      );
    }
  }

  openModal(id) {
    this.modalService.open(id);
  }

  closeModal(id) {
    this.modalService.close(id);
  }

  doCancel() {
    this.modalService.open('cancel-modal');
  }

  doCancelConfirm() {
    this.evService.postReleaseSlot({carSlotId:this.carSlotId}).subscribe(
      response => this.router.navigateByUrl('/checkin'),
      error => this.handleError(console.log("Couldn't cancel the reservation. This is usually not critical"))
    );
  }

  doBack() {
    if (this.pageDisplayId <= 1) {
      if (this.baseModule === '/checkin') {
        this.router.navigateByUrl(this.baseModule + '/carReview');
      } else {
        this.router.navigateByUrl(this.baseModule);
      }
    } else {
      this.resetForm();
      this.router.navigateByUrl(this.baseModule + '/survey/' + (this.pageDisplayId - 1));
    }
  }

  doNext(questionOption) {
    if (questionOption) {
      this.storeResponse(questionOption.id, questionOption.survey_question_id, null);
    } else if (this.questions[0].type === 'SCALE') {
      this.handleScaleResponses();
    } else {
      this.extractTextResponse();
    }

    if (this.pageDisplayId == this.totalQuestions) {
      this.submitEverything();
    } else {
      this.resetForm();
      this.router.navigateByUrl(this.baseModule + '/survey/' + (this.pageDisplayId + 1));
    }
  }

  doQuestionOptionSelect(questionOption) {
    if (questionOption.free_form == 1) {
      this.handleTextEntry(questionOption);
    } else {
      this.doNext(questionOption);
    }
  }

  resetForm() {
    this.nextVisible = false;
    this.sliderValues = [];
    this.textVisible = false;
    const questionPane = document.getElementById('survey-pane-container');
    questionPane.scrollTo(0,0);
  }

  storeResponse(optionId, questionId, textValue) {
    let response: any = {
      questionId: Number(questionId),
      optionId: Number(optionId)
    };

    if (textValue) {
      response.text = textValue;
    }

    localStorage.setItem('response_' + questionId, JSON.stringify(response));
  }

  handleScaleResponses() {
    let question: any;
    let option: any;
    let value: string;

    for (let i = 0; i < this.sliderValues.length; i++) {
      question = this.questions.find(question => question.order_index == i);

      if (question) {
        value = this.sliderValues[question.order_index] || "1";
        option = question.surveyQuestionOptions.find(option => option.order_index + 1 == value);
        this.storeResponse(option.id, question.id, null);
      } else {
        this.handleError("Can't find question for order_index " + i);
      }
    }
  }

  extractTextResponse() {
    const textElement = document.getElementsByClassName('text-entry').item(0) as HTMLInputElement;
    let response: string = textElement ? textElement.value : "Not specified";

    this.storeResponse(textElement.id, this.questions[0].id, response);
  }

  handleTextEntry(questionOption) {
    const element = document.getElementsByClassName('question-option-text').item(0);
    if (element) {
      const button = document.getElementsByClassName('has-text').item(0);
      element.classList.remove('hidden');
      button.classList.add('hidden');
      this.textVisible = true;
      this.nextVisible = true;
    }
  }

  submitEverything() {
    this.isSubmitting = true;
    this.openModal('loading-modal');
    const email = localStorage.getItem('email');
    const confirmationNumber = localStorage.getItem('confirmationNumber');

    const responseKeys = Object.keys(localStorage);
    let i, key;
    let responses: any[] = [];

    for(i = 0; i < responseKeys.length; i++) {
      key = responseKeys[i];
      if (key.startsWith("response_")) {
        responses.push(JSON.parse(localStorage.getItem(key)));
      }
    }

    const surveyData = {
      email: email,
      surveyId: this.surveyId,
      responses: responses
    };

    if (confirmationNumber) {
      surveyData['confirmationNumber'] = confirmationNumber;
    }

    this.evService.postSurvey(surveyData).subscribe(
      response => this.handleSurveyPostResponse(response),
      error => this.handleError(error)
    );
  }

  handleSurveyPostResponse(response) {
    if (this.baseModule === '/checkout') {
      this.closeModal('loading-modal');
      this.isSubmitting = false;
      this.router.navigateByUrl('/checkout/thankYou');
    } else {
      const selectedTime = JSON.parse(localStorage.getItem('selectedTime'));
      const selectedCar = JSON.parse(localStorage.getItem('selectedCar'));
      const email = localStorage.getItem('email');

      const carSlotId = selectedCar.times[selectedTime.formattedTime].timeSlotId;

      const scheduleDriveData = {
        email: email,
        carSlotId: carSlotId
      };

      this.evService.postScheduleDrive(scheduleDriveData).subscribe(
        response => this.handleScheduleDrivePostResponse(response),
        error => this.handleError(error)
      );
    }
  }

  handleScheduleDrivePostResponse(response) {
    this.isSubmitting = false;
    this.closeModal('loading-modal');
    if (response) { //TODO: Don't do this
      localStorage.setItem('confirmationNumber', "R1"); //TODO: Make this not hardcoded
      if (this.baseModule === '/checkin') {
        this.router.navigateByUrl('/checkin/carConfirm');
      } else {
        this.router.navigateByUrl('/checkout/thankYou');
      }
    } else {
      this.handleError("no confirmation number!");
    }
  }

  handleError(error) {
    console.log(error);
    this.isSubmitting = false;
    this.closeModal('loading-modal');
    this.openModal('error-modal');
  }
}
