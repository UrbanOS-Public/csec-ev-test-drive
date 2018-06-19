import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {

  nextVisible = false;
  questionHeaderText: string;
  showQuestionText = true;
  questions: any[] = [];
  surveyId: number;
  questionGroupId: number;
  pageId = 0;
  pageDisplayId = 0;
  totalQuestions = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.determineQuestionFromRoute();
  }

  determineQuestionFromRoute() {
    const url = this.router.url;
    const type = url.indexOf('checkin') >= 0 ? 'pre' : 'post';
    const surveyObject = JSON.parse(localStorage.getItem(
      type + 'SurveyQuestions'));

    this.route.params.subscribe(
      params => {
        if ( !params['questionId']) {
          this.router.navigateByUrl(this.router.url + '/1');
        } else {
          const questionGroup = surveyObject.question_groups.find(group => {
            return group.order_index == this.pageId;
          });

          if (questionGroup) {
            this.pageId = params['questionId'];
            this.pageDisplayId = Number(this.pageId);
            this.surveyId = surveyObject.id;
            this.questionGroupId = questionGroup.id;
            this.questions = questionGroup.surveyQuestions;
            this.questionHeaderText = questionGroup.text || this.questions[0].text;
            this.showQuestionText = questionGroup.text ? true : false;
            this.totalQuestions = surveyObject.question_groups.length;
          } else {
            console.log("Can't find question group!");
          }
        }
      }
    );
  }

  doCancel() {
    this.router.navigateByUrl('/checkin');
  }

  doBack() {
    if (this.pageId <= 1) {
      this.router.navigateByUrl('/checkin/carReview');
    } else {
      this.router.navigateByUrl('/checkin/survey/' + (this.pageDisplayId - 1));
    }
  }

  doNext() {
    if (this.pageId == this.totalQuestions - 1) {
      this.router.navigateByUrl('/checkin/carConfirm');
    } else {
      this.router.navigateByUrl('/checkin/survey/' + (this.pageDisplayId + 1));
    }
  }

  doQuestionOptionSelect(questionOption) {
    if (questionOption.free_form == 1) {
      this.handleTextEntry(questionOption);
    } else {
      this.doNext();
    }
  }

  handleTextEntry(questionOption) {
    this.nextVisible = true;
    // What Do?
  }
}
