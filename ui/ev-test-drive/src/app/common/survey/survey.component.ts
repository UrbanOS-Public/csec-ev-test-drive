import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { EVService } from '../../common/ev.service';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private evService: EVService) { }

  ngOnInit() {
    this.determineQuestionFromRoute();
  }

  determineQuestionFromRoute() {
    const url = this.router.url;
    this.surveyType = url.indexOf('checkin') >= 0 ? 'pre' : 'post';
    const surveyObject = JSON.parse(localStorage.getItem(
      this.surveyType + 'SurveyQuestions'));

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

  doCancel() {
    this.router.navigateByUrl('/checkin');
  }

  doBack() {
    if (this.pageDisplayId <= 1) {
      this.router.navigateByUrl('/checkin/carReview');
    } else {
      this.resetForm();
      this.router.navigateByUrl('/checkin/survey/' + (this.pageDisplayId - 1));
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
      this.router.navigateByUrl('/checkin/survey/' + (this.pageDisplayId + 1));
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
        value = this.sliderValues[question.order_index];
        option = question.surveyQuestionOptions.find(option => option.order_index + 1 == value);
        this.storeResponse(option.id, question.id, null);
      } else {
        console.log("Can't find question for order_index " + i);
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
    const email = localStorage.getItem('email');

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

    console.log(surveyData);

    this.evService.postSurvey(surveyData).subscribe(
      response => this.handleSurveyPostResponse(response),
      error => console.log(error)
    );
  }

  handleSurveyPostResponse(response) {
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
      error => console.log(error)
    );
  }

  handleScheduleDrivePostResponse(response) {
    if (response.confirmation_number) {
      console.log(response.confirmation_number);
    } else {
      console.log("no confirmation number!");
    }
  }
}
