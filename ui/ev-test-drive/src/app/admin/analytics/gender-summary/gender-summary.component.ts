import { Component, OnInit, OnChanges,  Input } from '@angular/core';
import _ from 'underscore';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';

@Component({
  selector: 'app-gender-summary',
  templateUrl: './gender-summary.component.html',
  styleUrls: ['./gender-summary.component.scss']
})
export class GenderSummaryComponent implements OnInit, OnChanges {
  @Input() sourceData;
  rows = [{gender:null,drivesPercent:null}];
  columns = ["gender", "drivesPercent"];
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.rows = [];
    var byGender = _.groupBy(this.sourceData, "PRE - Gender");
    _.each(byGender, (drives, gender) => {
      this.rows.push({gender:gender, drivesPercent: Math.round((drives.length / this.sourceData.length * 100))});
    });
  }

  doExport() {
    var headers = ["Gender", "% of Drives"];
    new Angular5Csv(this.rows, 'GenderSummaryMetrics', {headers:headers});
  }

}
