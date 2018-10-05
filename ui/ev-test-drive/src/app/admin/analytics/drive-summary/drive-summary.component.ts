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
  columns = ['week'];
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    const uniqueWeeks = new Set(this.sourceData.map(item => moment(item.date).startOf('week').format('YYYY-MM-DD')));
    var weeks = Array.from(uniqueWeeks);
    const uniqueCars = new Set(this.sourceData.map(item => item.model));
    var cars = Array.from(uniqueCars);
    console.log(weeks, cars);

    var rows = weeks.map((week) => { 
      return {
        week:week,
        carSummary: new Map()
      };
    });

    rows.forEach((row) => {
      var carSummary = new Map();
      cars.forEach((car) => {
        var drives = this.sourceData.find((data) => data.model == car).length;
        var optIns = this.sourceData.find((data) => data["POST - Would you like someone from the local dealership to contact you with more information about electric vehicles (EVs)?"].includes("Yes")).length;
        carSummary.set(car,{drives:drives, optIns: optIns});
      });
      console.log("CarSummary", carSummary);
      row.carSummary = carSummary;
    });

    console.log(rows);
    this.rows = rows;
    this.cars = cars;
    this.cars.forEach((car) => {
      this.columns.push(`${car}Drives`);
      this.columns.push(`${car}OptIns`);
    })
  }

}
