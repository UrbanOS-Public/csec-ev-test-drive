import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EVService } from '../../common/ev.service';
import { Helpers } from '../../app.helpers';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  schedule: any[] = [];
  formattedDate: string;
  helpers = new Helpers();

  constructor(
    private router: Router,
    private evService: EVService) { }

  ngOnInit() {
    this.evService.getSchedule().subscribe(
      schedule => this.handleSchedule(schedule),
      error => this.handleError(error)
    );

    this.formattedDate = this.formatDate(new Date());
  }

  handleSchedule(schedule) {
    this.schedule = schedule.sort((a, b) => {
      let aNum = Number(a.scheduled_start_time.substring(0,2)
                        + a.scheduled_start_time.substring(3,5));
      let bNum = Number(b.scheduled_start_time.substring(0,2)
                        + b.scheduled_start_time.substring(3,5));
      if (aNum > bNum) {
        return 1;
      } else if (aNum < bNum) {
        return -1;
      } else {
        return 0;
      }
    });
    this.schedule.forEach(slot => {
      slot.formattedTime = this.helpers.formatAMPM(slot.scheduled_start_time);
    });
  }

  handleError(error) {
    console.log(error);
  }

  formatDate(date: Date) {
    const today = new Date();
    const months = ['January', 'February', 'March', 'April',
                    'May', 'June', 'July', 'August', 'September',
                    'October', 'November', 'December'];
    let dateStr = '';
    
    if (today.getMonth() === date.getMonth()
     && today.getDate() === date.getDate()
     && today.getFullYear() === date.getFullYear()) {
      dateStr += 'Today, ';
    }

    dateStr += `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

    return dateStr;
  }
}
