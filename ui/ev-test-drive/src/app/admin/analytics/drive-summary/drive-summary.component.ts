import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-drive-summary',
  templateUrl: './drive-summary.component.html',
  styleUrls: ['./drive-summary.component.scss']
})
export class DriveSummaryComponent implements OnInit {
  @Input() sourceData;
  constructor() { }

  ngOnInit() {
  }

}
