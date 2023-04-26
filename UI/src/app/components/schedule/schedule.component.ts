import {Component} from '@angular/core';
import {CalendarOptions} from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: this.handleDateClick.bind(this),
    events: [
      {title: 'event 1', date: '2023-01-01'},
      {title: 'event 2', date: '2023-01-02'}
    ]
  };

  handleDateClick(arg: any) {
    alert('date click! ' + arg.dateStr)
  }
}
