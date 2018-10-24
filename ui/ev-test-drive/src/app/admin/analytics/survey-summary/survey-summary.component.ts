import { Component, OnInit, Input, OnChanges } from '@angular/core';
import _ from 'underscore';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
@Component({
  selector: 'app-survey-summary',
  templateUrl: './survey-summary.component.html',
  styleUrls: ['./survey-summary.component.scss']
})
export class SurveySummaryComponent implements OnInit, OnChanges {
  @Input() sourceData;
  columns = ['question','answer','preAnswers','postAnswers', 'diffPoints'];
  rows;
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    const totalQuestions = this.sourceData.length;
    if (totalQuestions > 0) {
      const questionPairs = this.getQuestionPairs(Array.from(Object.getOwnPropertyNames(this.sourceData[0])));
      this.rows = [];
      questionPairs.forEach(questionPair => {
        var byPreQuestion = _.groupBy(this.sourceData, "PRE - " + questionPair);
        var byPostQuestion = _.groupBy(this.sourceData, "POST - " + questionPair);
        _.each(byPreQuestion, (question, answer) => {
          const preAnswersPercent = this.rationalPercent(question.length, totalQuestions);
          const postAnswersPercent = byPostQuestion[answer] ? this.rationalPercent(byPostQuestion[answer].length, totalQuestions) : 0
          this.rows.push({
            question:questionPair, 
            answer:answer, 
            preAnswersPercent:preAnswersPercent, 
            postAnswersPercent:postAnswersPercent,
            pointDelta:postAnswersPercent-preAnswersPercent
          });
        });
      });
    }
  }

  getRawQuestions(questions, type) {
    return questions.filter(question => question.includes(type))
                    .map(question => question.replace(`${type} - `, ""));
  }

  getQuestionPairs(questions) {
    var rawPreQuestions = this.getRawQuestions(questions, 'PRE');
    var rawPostQuestions = this.getRawQuestions(questions, 'POST');
    return _.intersection(rawPreQuestions, rawPostQuestions);
  }

  rationalPercent(part, total) {
    const rawPercent = part / total;
    return Math.round(rawPercent * 100);
  }

  doExport() {
    var headers = ['Question','Answer','Pre-Survey Answers','Post-Survey Answers', 'Delta Percentage Points'];
    new Angular5Csv(this.rows, 'SurveySummaryMetrics', {headers:headers});
  }

}
