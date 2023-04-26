import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';
import {map, Observable, startWith} from "rxjs";
import {RequestsService} from "../../services/requests.service";
import {HttpClient} from "@angular/common/http";
import {SnackbarService} from "../../services/snackbar.service";
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";


@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})

export class TeacherComponent implements OnInit {
  control = new UntypedFormControl('');
  students: any;
  filteredStudents: Observable<any[]>;
  recipients: any[] = []
  @ViewChild('studentInput') studentInput: ElementRef<HTMLInputElement>;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  seatArray: any[][] = [];
  loaded: boolean = false;
  buttonsDisabled: boolean = false;

  hovered: any;
  nbsp: any = String.fromCharCode(160);
  room;

  moving: any = undefined;
  movingI;
  movingJ;
  noSwap;

  toDelete: any[] = [];
  toAdd: any[] = [];

  subject: any = '';
  body: any = '';

  @Input() course;
  async
  private
  protected readonly undefined = undefined;

  constructor(private requestService: RequestsService, private http: HttpClient, private snackBar: SnackbarService) {
  }

  async ngOnInit() {
    this.requestService.sendGetRequest(`api/class/get_all_users_from_class?class_id=${this.course.class_id}`).then(response => {
      if (response.error === undefined) {
        this.students = response.message.sort((a, b) => a.user_id > b.user_id ? 1 : -1)
        this.filteredStudents = this.control.valueChanges.pipe(startWith(''), map(value => this.filter(value || '')),);
      } else {
        if (response.error.error !== "That class is empty") this.requestService.logError(response)
      }

      this.requestService.sendGetRequest(`api/room/get_all_room_info?room_id=${this.course.room_id}`).then(room => {
        if (room.error === undefined) {
          this.room = room.message[0]
          for (let i = 0; i < this.room.room_width; i++) {
            this.seatArray[i] = []
            for (let j = 0; j < this.room.room_length; j++) {
              this.seatArray[i][j] = this.nbsp
            }
          }

          this.requestService.sendGetRequest(`api/class/get_all_chairs_from_class?class_id=${this.course.class_id}`).then(seats => {
            if (seats.error === undefined) {
              for (let seat of seats.message) {
                this.seatArray[seat.chair_x][seat.chair_y] = {
                  "student": this.students.find(student => student.student_id === seat.student_id),
                  "chair_id": seat.chair_id
                }
              }
              this.loaded = true;
            } else {
              this.requestService.logError(seats)
            }
          })
        } else {
          this.requestService.logError(room)
        }
      })
    })
  }

  canSwap(box) {
    if (this.moving) {
      return box.student && box !== this.moving;
    }
    return false;
  }

  save() {
    if (this.toDelete.length > 0) {
      const body = {"chair_ids": this.toDelete}
      this.requestService.sendDeleteRequest("api/seating/remove_chair_from_seating_arrangement", body).then(response => {
        if (response.error === undefined) {
          this.toDelete = []
          if (this.toAdd.length > 0) this.post();
          else this.snackBar.openSnackbar("Saved")
        } else {
          this.requestService.logError(response);
        }
      })
    } else if (this.toAdd.length > 0) {
      this.post()
    } else {
      this.snackBar.openSnackbar("Nothing to Save")
    }
  }

  post() {
    if (this.toAdd.length > 0) {
      const body = {
        "class_id": this.course.class_id,
        "arrangement": this.toAdd
      }
      this.requestService.sendPostRequest("api/seating/add_chairs_to_seating_arrangement", body).then(response => {
        if (response.error === undefined) {
          this.toAdd = []
          this.snackBar.openSnackbar("Saved")
        } else {
          this.requestService.logError(response);
        }
      })
    } else {
      this.snackBar.openSnackbar("Saved")
    }
  }

  move(box, i?, j?) {
    this.buttonsDisabled = true
    if (this.moving === undefined) {
      if (i !== undefined && j !== undefined) {
        this.movingI = i;
        this.movingJ = j;
      } else {
        this.snackBar.openSnackbar("fausiodfasdf")
      }
      this.moving = box;

    } else if (this.moving === box) { //remove box
      if (this.moving.chair_id) this.toDelete.push(this.moving.chair_id)
      this.moving = undefined;
      this.seatArray[i][j] = this.nbsp;
      this.buttonsDisabled = false;

    } else if (this.seatArray[i][j] != this.nbsp) {
      const temp = this.seatArray[i][j]

      if (this.moving.chair_id) {
        this.toDelete.push(this.moving.chair_id)
      }
      if (temp.chair_id) {
        this.toDelete.push(temp.chair_id)
      }

      this.seatArray[i][j] = this.moving;
      this.seatArray[this.movingI][this.movingJ] = temp;

      this.toAdd = this.toAdd.filter(toAdd => toAdd.student_id !== this.moving.student.student_id)
      this.toAdd = this.toAdd.filter(toAdd => toAdd.student_id !== temp.student.student_id)
      this.toAdd.push({"x": i, "y": j, "student_id": this.moving.student.student_id})
      this.toAdd.push({"x": this.movingI, "y": this.movingJ, "student_id": temp.student.student_id})

      this.moving = undefined
      this.buttonsDisabled = false;

    } else if (i !== undefined && j !== undefined) {
      this.toAdd = this.toAdd.filter(toAdd => toAdd.student_id !== this.moving.student.student_id)
      if (this.moving.chair_id) this.toDelete.push(this.moving.chair_id)
      if (this.movingI && this.movingJ) this.seatArray[this.movingI][this.movingJ] = this.nbsp;

      this.moving.chair_id = undefined
      this.seatArray[i][j] = this.moving;
      this.toAdd.push({"x": i, "y": j, "student_id": this.moving.student.student_id})
      this.moving = undefined
      this.buttonsDisabled = false;
    }

  }

  startMove(student) {
    if (this.moving === undefined) {
      this.moving = {"student": student};
      this.toAdd = this.toAdd.filter(toAdd => toAdd.student_id !== student.student_id)
      this.seatArray.forEach((row, i) => {
        let found = row.findIndex(box => box.student && box.student.student_id === student.student_id)
        while (found !== -1) {
          if (row[found].chair_id !== undefined) {
            this.toDelete.push(row[found].chair_id)
          }
          row[found] = this.nbsp
          found = row.findIndex(box => box.student && box.student.student_id === student.student_id)
        }
      })
    } else {
      this.snackBar.openSnackbar("Please finish moving the current student before selecting another")
    }

  }

  add_chip(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add value
    if (value) {
      this.recipients.push(value);
    }
    // Clear input
    event.chipInput!.clear();

    this.control.setValue(null);
  }

  remove_chip(student: string): void {
    const index = this.recipients.indexOf(student);

    if (index >= 0) {
      this.recipients.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.recipients.push(event.option.value);
    this.studentInput.nativeElement.value = '';
    this.control.setValue(null);
  }

  sendEmail() {
    this.buttonsDisabled = true;
    let recipients = []
    this.recipients.forEach(recip => {
      recipients.push(recip.user_id)
    })
    const body = {
      "email_to": recipients,
      "email_subject": this.course.class_name + ": " + this.subject,
      "email_body": this.body
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

// Autocomplete Functions
  filter(value: string): string[] {
    const filterValue = value && value.length > 0 ? value.toLowerCase() : "";
    return this.students.filter(option => {
      return option.last_name.toLowerCase().includes(filterValue) && !this.recipients.includes(option)
    });
  }

  // Chip List Functions
  showName(student): string | undefined {
    return student ? student.last_name + ',' + student.first_name : undefined;
  }

  getName(student) {
    if (student && student.student && student.student.first_name && student.student.last_name) {
      return student.student.first_name + " " + student.student.last_name
    }
    return undefined
  }

  getBox(student) {
    if (student && student.student) {
      return `${student.student.first_name.at(0)}.${student.student.last_name.slice(0, 3)}`
    } else {
      return this.nbsp
    }
  }
}

