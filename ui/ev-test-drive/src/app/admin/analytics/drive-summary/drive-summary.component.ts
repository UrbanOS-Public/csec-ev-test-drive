import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as moment from 'moment';
import _ from 'underscore';
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
    if (!this.sourceData){
      return;
    }
    const uniqueWeeks = new Set(this.sourceData.map(item => {
      return `${moment(item.date).startOf('week').format('MM-DD')} - ${moment(item.date).endOf('week').format('MM-DD')}`;
    }));
    var weeks = Array.from(uniqueWeeks);
    const uniqueCars = new Set(this.sourceData.map(item => item.model));
    var cars = Array.from(uniqueCars);

    var rows = weeks.map((week) => { 
      return {
        week:week,
        carSummary: new Map(),
        totalOptIns: 0,
        totalDrives: 0
      };
    });
    var drives = _.groupBy(this.sourceData, 'model');
    var optIns = _.groupBy(this.sourceData, 'POST - Would you like someone from the local dealership to contact you with more information about electric vehicles (EVs)?')["Yes, and I give you permission to share my contact information for this purpose"];
    var optInsPerWeek = _.groupBy(optIns, (optIn) => {
      return moment(optIn.date).startOf('week').format('YYYY-MM-DD');
    });
    var drivesPerWeek = _.groupBy(this.sourceData, (drive) => {
      return moment(drive.date).startOf('week').format('YYYY-MM-DD');
    });
    var optInsPerCar = _.groupBy(optIns, 'model');

    rows.forEach((row) => {
      var carSummary = new Map();
      row.totalOptIns = optInsPerWeek[row.week] ? optInsPerWeek[row.week].length : 0;
      row.totalDrives = drivesPerWeek[row.week] ? drivesPerWeek[row.week].length : 0;
      var optInsPerCarPerWeek = _.groupBy(optInsPerWeek[row.week], 'model');
      cars.forEach((car) => {
        var drivesPerWeek = _.groupBy(drives[car], (drive) => {
          return moment(drive.date).startOf('week').format('YYYY-MM-DD');
        });
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

}
