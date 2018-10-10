import { Component, OnInit, OnChanges, Input } from '@angular/core';
import _ from 'underscore';
import * as moment from 'moment';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';

@Component({
  selector: 'app-day-summary',
  templateUrl: './day-summary.component.html',
  styleUrls: ['./day-summary.component.scss']
})
export class DaySummaryComponent implements OnInit, OnChanges {
  @Input() sourceData;
  rows = [{day:null,drivesPercent:null, drives:null}];
  columns = ["day", "drives", "drivesPercent"];
  dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.sourceData.length > 0) {
      this.rows = [];
      var byDay = _.groupBy(this.sourceData, (drive) => {
        return moment(drive.date).format('dddd');
      });
      this.dayOrder.forEach((day) => {
        this.rows.push({day:day, drivesPercent: Math.round((byDay[day].length / this.sourceData.length * 100)), drives:byDay[day].length});
      });
    }
  }

  doExport() {
    var headers = ["Day", "Drives", "% of Drives"];
    new Angular5Csv(this.rows, 'DaySummaryMetrics', {headers:headers});
  }

}
