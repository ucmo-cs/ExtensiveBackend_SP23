import {Component, OnInit} from '@angular/core';
import {RequestsService} from "../../../services/requests.service";
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {SnackbarService} from "../../../services/snackbar.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-class-creator',
  templateUrl: './class-creator.component.html',
  styleUrls: ['./class-creator.component.scss']
})
export class ClassCreatorComponent implements OnInit {
  teacherFilter = new FormControl(' ');
  filteredTeachers: Observable<any[]>;
  roomFilter = new FormControl(' ');
  filteredRooms: Observable<any[]>;

  buttonsDisabled: boolean = true;

  teacherUser;
  roomUser;
  className: string = "";
  classHour: string = "";
  hours: number[] = [1, 2, 3, 4, 5, 6, 7];
  teachers;
  rooms;

  constructor(private requestService: RequestsService, private snackbar: SnackbarService, private dialogRef: MatDialogRef<ClassCreatorComponent>) {
  }

  async ngOnInit() {
    this.snackbar.spinner = true;
    this.requestService.sendGetRequest("api/room/get_all_rooms").then(responseRooms => {
      this.requestService.sendGetRequest("api/user/get_all_users?role_id=2", {}).then(responseTeachers => {
        if (responseRooms.error === undefined && responseTeachers.error === undefined) {
          this.teachers = responseTeachers.message;
          this.rooms = responseRooms.message;
          this.filteredTeachers = this.teacherFilter.valueChanges.pipe(
            startWith(''),
            map(value => this.filterTeachers(value || '')),
          );
          this.filteredRooms = this.roomFilter.valueChanges.pipe(
            startWith(''),
            map(value => this.filterRooms(value || '')),
          );
          this.buttonsDisabled = false;
          this.snackbar.spinner = false
        } else {
          this.snackbar.openSnackbar("Error Loading Page, try again later.")
          this.buttonsDisabled = false;
          this.snackbar.spinner = false
        }
      });
    });
  }

  public submit() {
    this.buttonsDisabled = true;
    this.snackbar.spinner = true;
    const body = {
      "teacher_username": this.teacherUser.username,
      "class_name": this.className,
      "hour": this.classHour,
      "room_id": this.roomUser.room_id
    }
    this.requestService.sendPostRequest("api/class/add_class", body).then(response => {
      this.snackbar.spinner = false
      if (response.error === undefined) {
        this.dialogRef.close(true);
      } else {
        this.requestService.logError(response)
        this.buttonsDisabled = false;
      }
    })
  }

  showTeacher(teacher): string | undefined {
    return teacher ? teacher.first_name + " " + teacher.last_name : undefined;
  }

  showRoom(room): string | undefined {
    return room ? room.room_name : undefined;
  }

  private filterTeachers(value: string): string[] {
    const filterValue = value && value.length > 0 ? value.toLowerCase() : "";
    return this.teachers.filter(teacher =>
      (teacher.first_name + " " + teacher.last_name).toLowerCase().includes(filterValue.toLowerCase()))
  }

  private filterRooms(value: string): string[] {
    const filterValue = value && value.length > 0 ? value.toLowerCase() : "";
    return this.rooms.filter(option => option.room_name ? option.room_name.toLowerCase().includes(filterValue) : false);
  }

}
