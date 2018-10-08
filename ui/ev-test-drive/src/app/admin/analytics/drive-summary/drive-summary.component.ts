import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as moment from 'moment';
import _ from 'underscore';
import * as globals from '../../../app.constants';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
@Component({
  selector: 'app-drive-summary',
  templateUrl: './drive-summary.component.html',
  styleUrls: ['./drive-summary.component.scss']
})
export class DriveSummaryComponent implements OnInit, OnChanges {
  @Input() sourceData;
  rows = [];
  cars = [];
  totals = new Map();
  columns = ['week', 'drives', 'optins'];
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (!this.sourceData || !this.sourceData.map){ // This prevents console errors due to the async data not being loaded yet.
      return;
    }
    const uniqueWeeks = new Set(this.sourceData.map(item => this.weekStart(item.date)));
    var weeks = Array.from(uniqueWeeks);
    const uniqueCars = new Set(this.sourceData.map(item => item.model));
    var cars = Array.from(uniqueCars);

    var rows = weeks.map((week) => { 
      return {
        week:week,
        weekLabel: `${moment(week).startOf('week').format('MM-DD')} - ${moment(week).endOf('week').format('MM-DD')}`,
        totalOptIns: 0,
        totalDrives: 0,
        carSummary: new Map()
      };
    });
    var drives = _.groupBy(this.sourceData, 'model');
    var optIns = _.groupBy(this.sourceData, globals.optInQuestion)[globals.optInAnswer];
    var optInsPerWeek = _.groupBy(optIns, (optIn) => this.weekStart(optIn.date));
    var drivesPerWeek = _.groupBy(this.sourceData, (drive) => this.weekStart(drive.date));
    var optInsPerCar = _.groupBy(optIns, 'model');

    rows.forEach((row) => {
      var carSummary = new Map();
      row.totalOptIns = optInsPerWeek[row.week] ? optInsPerWeek[row.week].length : 0;
      row.totalDrives = drivesPerWeek[row.week] ? drivesPerWeek[row.week].length : 0;
      var optInsPerCarPerWeek = _.groupBy(optInsPerWeek[row.week], 'model');
      cars.forEach((car) => {
        var drivesPerWeek = _.groupBy(drives[car], (drive) => this.weekStart(drive.date));
        carSummary.set(car,
          {
            drives:drivesPerWeek[row.week] ? drivesPerWeek[row.week].length : 0, 
            optIns:optInsPerCarPerWeek[car] ? optInsPerCarPerWeek[car].length: 0
        });
      });
      row.carSummary = carSummary;
    });

    cars.forEach((car) => {
      this.totals.set(car, {
        drives:drives[car] ? drives[car].length : 0,
        optIns:optInsPerCar[car] ? optInsPerCar[car].length : 0
      });
      this.totals.set('allDrives', this.sourceData ? this.sourceData.length: 0);
      this.totals.set('allOptIns', optIns ? optIns.length : 0);
    })

    this.rows = rows;
    this.cars = cars;
    this.cars.forEach((car) => {
      this.columns.push(`${car}Drives`);
      this.columns.push(`${car}OptIns`);
    })
  }

  weekStart(date) {
    return moment(date).startOf('week').format('YYYY-MM-DD');
  }

  doExport() {
    var headers = ["Week Of", "Total Drives", "Total Opt-Ins"];
    const uniqueCars = new Set(this.sourceData.map(item => item.model));
    var cars = Array.from(uniqueCars);
    cars.forEach((car) => {
      headers.push(`${car} Drives`);
      headers.push(`${car} Opt Ins`);
    });
    var exportRows = this.rows.map((row) => {
      var newRow = {...row};
      newRow.carSummary.forEach((summary: any, car: string) => {
        newRow[`${car} Drives`] = summary.drives;
        newRow[`${car} Opt Ins`] = summary.optIns;
      });
      delete newRow.carSummary;
      delete newRow.week;
      return newRow;
    });
    new Angular5Csv(exportRows, 'DriveSummaryMetrics', {headers:headers});
  }

}
