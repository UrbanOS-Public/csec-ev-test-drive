import { Component, OnInit, OnChanges, Input } from '@angular/core';
import _ from 'underscore';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';

@Component({
  selector: 'app-zipcode-summary',
  templateUrl: './zipcode-summary.component.html',
  styleUrls: ['./zipcode-summary.component.scss']
})
export class ZipcodeSummaryComponent implements OnInit, OnChanges {
  @Input() sourceData;
  columns = ["zipcode", "drives"];
  rows: zipcodeRow[] = [new zipcodeRow(1, 1)];
  constructor() { }

  ngOnInit() {
    
  }

  ngOnChanges() {
    this.rows = [];
    var byZipcode = _.groupBy(this.sourceData, 'zipcode');
    _.each(byZipcode, (drives, zipcode) => {
      this.rows.push(new zipcodeRow(zipcode, drives.length));
    });
    this.rows = _.sortBy(_.sortBy(this.rows, 'zipcode'), 'drives').reverse();
    
  }

  doExport() {
    var headers = ["Zipcode", "Drives"];
    new Angular5Csv(this.rows, 'ZipcodeSummaryMetrics', {headers:headers});
  }

}

class zipcodeRow {
  zipcode: number;
  drives: number;

  constructor(zipcode, drives) {
    this.zipcode = zipcode;
    this.drives = drives;
  } 
}
