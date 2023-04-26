import {Component, Inject, OnInit} from '@angular/core';
import {RequestsService} from "../../../services/requests.service";
import {SnackbarService} from "../../../services/snackbar.service";
import {map, startWith} from "rxjs/operators";
import {FormControl} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-change-teacher',
  templateUrl: './change-teacher.component.html',
  styleUrls: ['./change-teacher.component.scss']
})
export class ChangeTeacherComponent implements OnInit {
  teacherFilter = new FormControl(' ');
  public buttonsDisabled = false;
  public teachers
  public filteredTeachers;
  public newTeacher

  constructor(private rs: RequestsService, private snackbar: SnackbarService, private dialogRef: MatDialogRef<ChangeTeacherComponent>,
              @Inject(MAT_DIALOG_DATA) private updateClass
  ) {
  }

  async ngOnInit() {
    this.snackbar.spinner = true;
    this.rs.sendGetRequest("api/user/get_all_users", {role_id: 2}).then(TeacherResult => {
      if (TeacherResult.error == undefined) {
        this.teachers = TeacherResult.message;
        this.filteredTeachers = this.teacherFilter.valueChanges.pipe(
          startWith(''),
          map(value => this.filterTeachers(value || '')),
        );
      }
      this.snackbar.spinner = false;
    });
  }

  public submit() {
    this.buttonsDisabled = true;
    this.snackbar.spinner = true;
    this.rs.sendPutRequest("api/class/assign_teacher_to_class", {
      "teacher_id": this.newTeacher.teacher_id,
      "class_id": this.updateClass.class_id
    }).then(results => {
      this.snackbar.spinner = false
      if (results.error === undefined) {
        this.dialogRef.close(true);
      } else {
        this.rs.logError(results)
        this.buttonsDisabled = false;
      }
    });
  }

  showTeacher(teacher) {
    return teacher ? teacher.first_name + " " + teacher.last_name : undefined;
  }

  private filterTeachers(value: string): string[] {
    const filterValue = value && value.length > 0 ? value.toLowerCase() : "";
    return this.teachers.filter(teacher =>
      (teacher.first_name + " " + teacher.last_name).toLowerCase().includes(filterValue.toLowerCase()))
  }
}
