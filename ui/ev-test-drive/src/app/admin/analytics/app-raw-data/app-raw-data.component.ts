import { Component, OnInit, Input, OnChanges } from '@angular/core';
import _ from 'underscore';
import * as moment from 'moment';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { EVService } from 'src/app/common/ev.service';

@Component({
  selector: 'app-raw-data',
  templateUrl: './app-raw-data.component.html',
  styleUrls: ['./app-raw-data.component.scss']
})
export class AppRawDataComponent implements OnInit, OnChanges {
  @Input() sourceData;
  firstDay;
  lastDay;
  list = [];
  properties;
  @Input() pin;

  constructor(private evService: EVService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.sourceData.length > 0) {
      this.list = [];
      this.firstDay = _.min(this.sourceData, row => moment(row.date).valueOf()).date;
      this.lastDay = _.max(this.sourceData, row => moment(row.date).valueOf()).date;
      this.properties = Object.getOwnPropertyNames(this.sourceData[0]);
      this.sourceData.forEach(row => {
        let rowMap = new Map();
        this.properties.forEach(property => {
          rowMap.set(property, row[property]);
        });
        this.list.push(Array.from(rowMap.values()));
      });
    }
  }

  doExport() {
    var headers = this.properties;
    new Angular5Csv(this.list, 'AnalyticsSourceData', {headers:headers});
  }

  doEmailReport() {
    console.log('we are emailing')
    this.evService.postEmailAnalytics({pin:this.pin}).subscribe(
      response => this.handleEmail(response),
      error => this.handleError(error)
    );
  }

  handleEmail(response) {
    console.log('email sent', response)
  }

  handleError(error) {
    console.log('error', error)
  }

}
