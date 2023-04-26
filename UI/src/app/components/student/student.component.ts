import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';
import {map, Observable, startWith} from "rxjs";
import {RequestsService} from "../../services/requests.service";
import {HttpClient} from "@angular/common/http";
import {SnackbarService} from "../../services/snackbar.service";
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {AuthenticationService} from "../../services/authentication.service";


@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})

export class StudentComponent implements OnInit {
  control = new UntypedFormControl('');
  students: any;
  filteredStudents: Observable<any[]>;
  recipients: any[] = []
  @ViewChild('studentInput') studentInput: ElementRef<HTMLInputElement>;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  len: number;
  wid: number;
  teacher_name: any;
  seatArray: any[][];
  loaded: boolean = false;
  buttonsDisabled: boolean = false;

  hovered: any;
  nbsp: any = String.fromCharCode(160);

  moving: any = false;
  movingI;
  movingJ;
  noSwap;

  originalArray: any [] = [];
  toDelete: any[] = [];
  toAdd: any[] = [];

  subject: any = '';
  body: any = '';

  @Input() course;
  @Input() teach;
  async
  private

  constructor(private requestService: RequestsService, private http: HttpClient, private snackBar: SnackbarService, private authService: AuthenticationService) {
  }

  async ngOnInit() {
    this.requestService.sendGetRequest(`api/class/get_all_users_from_class?class_id=${this.course.class_id}`).then(response => {
      if (response.error === undefined) {
        this.students = response.message.sort((a, b) => a.user_id > b.user_id ? 1 : -1)
        this.filteredStudents = this.control.valueChanges.pipe(
          startWith(''),
          map(value => this.filter(value || '')),
        );
      } else {
        if (response.error.error !== "That class is empty") this.requestService.logError(response)
      }

      this.requestService.sendGetRequest(`api/class/get_all_chairs_from_class?class_id=${this.course.class_id}`).then(seats => {
        if (seats.error === undefined) {
          this.requestService.sendGetRequest(`api/room/get_all_room_info?room_id=${this.course.room_id}`).then(room => {
            if (room.error === undefined) {
              room = room.message[0]
              this.len = room.room_length;
              this.wid = room.room_width;
              this.seatArray = []
              for (let i = 0; i < this.wid; i++) {
                this.seatArray[i] = [];
                for (let j = 0; j < this.len; j++) {
                  let studentInChair = seats.message.find(chair => chair.chair_x == i && chair.chair_y == j);
                  if (studentInChair != undefined) {
                    let index = this.students.findIndex(student => student.student_id === studentInChair.student_id)
                    this.originalArray.push(studentInChair.chair_id)
                    this.students[index].chair_id = studentInChair.chair_id;
                    this.seatArray[i][j] = this.students[index];
                  } else {
                    this.seatArray[i][j] = this.nbsp;
                  }
                }
              }
              this.loaded = true;
            } else {
              this.requestService.logError(room)
            }
          })
        } else {
          this.requestService.logError(seats)
        }
      })
    })
    this.requestService.sendGetRequest(`api/user/get_user_info?user_id=${this.course.teach_user_id}`).then(teacher => {
      if (teacher.error === undefined) {
        this.teacher_name = teacher.message[0].first_name + ' ' + teacher.message[0].last_name
        this.filteredStudents = this.control.valueChanges.pipe(
          startWith(''),
          map(value => this.filter(value || '')),
        );
      } else {
        if (teacher.error.error !== "User doesnt exist") this.requestService.logError(teacher)
      }
    })
  }

  // Seating Chart Functions
  hover(student) {
    this.hovered = student;
  }

  unhover() {
    this.hovered = null;
  }


// Chip List Functions


  sendEmail() {
    this.buttonsDisabled = true;
    const body = {
      "email_to": [this.course.teach_user_id],
      "email_subject": "ID: " + this.authService.userid + " - " + this.subject,
      "email_body": this.body + "\n\nSent by: " + this.authService.username
    }
    this.requestService.sendPostRequest('api/generic/email_user', body).then(response => {
      if (response.error === undefined) {
        this.snackBar.openSnackbar(response.message)
        this.subject = '';
        this.body = '';
        this.recipients = [];
      } else {
        this.requestService.logError(response);
      }
      this.buttonsDisabled = false
    })
  }

//   Filter students for seating chart
  filter(value: string): string[] {
    const filterValue = value && value.length > 0 ? value.toLowerCase() : "";
    return this.students.filter(option => {
      return option.last_name.toLowerCase().includes(filterValue) && !this.recipients.includes(option)
    });
  }

}

