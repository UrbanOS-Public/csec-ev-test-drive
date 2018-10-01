import { Component, OnInit, Input } from '@angular/core';
import { EVService } from '../ev.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() title;
  constructor(private evService: EVService) { }

  ngOnInit() {
  }

  onLink(){
    const selectedCar = JSON.parse(localStorage.getItem('selectedCar'));
    const selectedTime = JSON.parse(localStorage.getItem('selectedTime'));
    if (selectedCar && selectedTime) {
      const carSlotId = selectedCar.times[selectedTime.formattedTime].timeSlotId;
      this.evService.postReleaseSlot({carSlotId:carSlotId}).subscribe();
    }
  }

}
