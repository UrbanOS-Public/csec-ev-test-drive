import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as moment from 'moment'

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnChanges {
  @Input() sourceData

  columns = ['date','start_time','end_time', 'slot_length_minutes', 'employees_per_slot', 'date_created']
  ngOnInit() {

  }

  ngOnChanges() {
    if(this.sourceData){
      this.sourceData = this.sourceData.map((row) => {
        return {
          ...row,
          date: moment(row.date).format('YYYY-MM-DD'),
          date_created: moment(row.date_created).format('YYYY-MM-DD'),
          start_time: moment(row.start_time, ['h:m: a','HH:mm:ss']).format('h:mm a'),
          end_time: moment(row.end_time, ['h:m a','H:m']).format('h:mm a'),
        }
      })
    }
  }

}
