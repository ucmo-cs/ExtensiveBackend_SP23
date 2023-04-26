import {Component, Inject, OnInit} from '@angular/core';
import {RequestsService} from "../../../services/requests.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent implements OnInit {

  users: any;
  usersFiltered: any;
  selectedUser: any;
  studentsInClass: any[];

  constructor(private requestService: RequestsService, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.studentsInClass = this.data.students;
    this.users = this.data.users;
    this.filterUsers()
  }

  filterUsers() {
    this.usersFiltered = this.users.filter(user => this.studentsInClass.findIndex(student => student.user_id === user.user_id) === -1)
    if (this.selectedUser && this.selectedUser.length > 0) {
      this.usersFiltered = this.usersFiltered.filter(user =>
        (user.first_name + " " + user.last_name).toLowerCase().includes(this.selectedUser.toLowerCase()))
    }
  }
}
