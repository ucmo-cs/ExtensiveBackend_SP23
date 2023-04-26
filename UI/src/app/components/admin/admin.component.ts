import {Component, OnInit} from '@angular/core';
import {RequestsService} from "../../services/requests.service";
import {MatDialog} from "@angular/material/dialog";
import {ClassCreatorComponent} from "./class-creator/class-creator.component";
import {SnackbarService} from "../../services/snackbar.service";
import {AppComponent} from "../../app.component";
import {UserCreatorComponent} from "./user-creator/user-creator.component";
import {RoomCreatorComponent} from "./room-creator/room-creator.component";
import {AddStudentComponent} from "./add-student/add-student.component";
import {ConfirmDeleteComponent} from "./confirm-delete/confirm-delete.component";
import {ChangeTeacherComponent} from "./change-teacher/change-teacher.component";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  classes: any;
  classesFiltered: any;
  selectedClass: any;
  studentsInClass;

  teachers: any;

  users: any;
  userType: any = "All";
  usersFiltered: any;
  selectedUser: any;

  rooms: any;
  roomsFiltered: any;
  selectedRoom: any;


  buttonsDisabled: boolean = true;
  showOptions: boolean = false;

  constructor(private requestService: RequestsService, private dialog: MatDialog, private snackbar: SnackbarService,
              private app: AppComponent) {
  }

  ngOnInit() {
    this.app.spinner = true;
    this.requestService.sendGetRequest("api/class/get_all_classes").then(responseClasses => {
      if (responseClasses.error === undefined) {
        this.requestService.sendGetRequest("api/user/get_all_users").then(responseUsers => {
          if (responseUsers.error === undefined) {
            this.requestService.sendGetRequest("api/room/get_all_rooms").then(responseRooms => {
              if (responseRooms.error === undefined) {
                this.users = responseUsers.message;
                this.usersFiltered = this.users;

                this.classes = responseClasses.message;
                this.classesFiltered = this.classes;

                this.rooms = responseRooms.message;
                this.roomsFiltered = this.rooms;


                this.requestService.sendGetRequest("api/user/get_all_users?role_id=2").then(responseTeachers => {
                  if (responseTeachers.error === undefined) {
                    this.teachers = responseTeachers.message;
                  }
                  this.app.spinner = false;
                  this.buttonsDisabled = false;
                })
              } else {
                this.requestService.logError(responseRooms)
                this.app.spinner = false;
                this.buttonsDisabled = false;
              }
            });
          } else {
            this.requestService.logError(responseUsers)
            this.app.spinner = false;
            this.buttonsDisabled = false;
          }
        });
      } else {
        this.requestService.logError(responseClasses)
        this.buttonsDisabled = false;
        this.app.spinner = false;
      }
    });
  }

  getTeacher(id) {
    if (this.teachers) {
      const teacher = this.teachers.find(teacher => teacher.teacher_id === id)
      if (teacher) {
        return `${teacher.last_name}, ${teacher.first_name}`
      } else {
        return "Teacher Not Found"
      }
    } else {
      return "Teacher Not Found"
    }
  }

  getRoom(id: number) {
    const room = this.rooms.find(room => room.room_id === id);
    return room ? room.room_name : "Room Name"
  }

  getStudents(id) {
    this.studentsInClass = [];
    this.buttonsDisabled = true;
    this.app.spinner = true;
    this.requestService.sendGetRequest(`/api/class/get_all_users_from_class?class_id=${id}`).then(response => {
      if (response.error === undefined) {
        this.studentsInClass = response.message;
      } else {
        this.snackbar.openSnackbar("That class is empty. Please delete it or add students");
        this.studentsInClass = [];
      }
      this.buttonsDisabled = false;
      this.app.spinner = false;
    })
  }

  getRole(id: number) {
    switch (id) {
      case 0:
        return "Student"
      case 2:
        return "Teacher"
      case 3:
        return "Admin"
      default:
        return ""
    }
  }

  filterClasses() {
    if (this.selectedClass && this.selectedClass.length > 0) {
      this.classesFiltered = this.classes.filter(course => course.class_name.toLowerCase().includes(this.selectedClass.toLowerCase()))
    } else {
      this.classesFiltered = this.classes
    }
  }

  filterUsers() {
    if (this.userType === "All") this.usersFiltered = this.users
    else {
      this.usersFiltered = this.users.filter(user => user.role_id === this.userType)
    }
    if (this.selectedUser && this.selectedUser.length > 0) {
      this.usersFiltered = this.usersFiltered.filter(user =>
        (user.first_name + " " + user.last_name).toLowerCase().includes(this.selectedUser.toLowerCase()))
    }
  }

  filterRooms() {
    if (this.selectedRoom && this.selectedRoom.length > 0) {
      this.roomsFiltered = this.rooms.filter(room => room.room_name.toLowerCase().includes(this.selectedRoom.toLowerCase()))
    } else {
      this.roomsFiltered = this.rooms
    }
  }

  deleteClass(id) {
    let dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      minWidth: "55%",
      height: "25%"
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.buttonsDisabled = true;
        this.app.spinner = true;
        const body = {"class_id": id}
        this.requestService.sendDeleteRequest("api/class/remove_class", body).then(response => {
          if (response.error === undefined) {
            this.snackbar.openSnackbar("Class Deleted")
            this.classes = this.classes.filter(course => course.class_id !== id);
            this.selectedClass = "";
            this.filterClasses();
            this.app.spinner = false;
            this.buttonsDisabled = false;
          } else {
            this.requestService.logError(response)
            this.app.spinner = false;
            this.buttonsDisabled = false;
          }
        })
      }
    })
  }

  deleteUser(id) {
    let dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      minWidth: "55%",
      height: "25%"
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.buttonsDisabled = true;
        this.app.spinner = true;
        const body = {"user_id": id}
        this.requestService.sendDeleteRequest("api/user/remove_user", body).then(response => {
          if (response.error === undefined) {
            this.snackbar.openSnackbar("User Deleted")
            this.users = this.users.filter(user => user.user_id !== id);
            this.selectedUser = "";
            this.filterUsers();
            this.app.spinner = false;
            this.buttonsDisabled = false;
          } else {
            this.requestService.logError(response)
            this.app.spinner = false;
            this.buttonsDisabled = false;
          }
        })
      }
    })
  }

  deleteRoom(id) {
    let dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      minWidth: "55%",
      height: "25%"
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.buttonsDisabled = true;
        this.app.spinner = true;
        const body = {"room_id": id}
        this.requestService.sendDeleteRequest("api/room/remove_room", body).then(response => {
          if (response.error === undefined) {
            this.snackbar.openSnackbar("Room Deleted")
            this.rooms = this.rooms.filter(room => room.room_id !== id);
            this.selectedRoom = "";
            this.filterRooms();
            this.app.spinner = false;
            this.buttonsDisabled = false;
          } else {
            this.requestService.logError(response)
            this.app.spinner = false;
            this.buttonsDisabled = false;
          }
        })
      }
    })
  }

  removeStudentFromClass(class_id, user_id) {
    let dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      minWidth: "55%",
      height: "25%"
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let body = {
          "class_id": class_id,
          "user_id": user_id
        }
        this.requestService.sendDeleteRequest("api/class/remove_user_from_class", body).then(response2 => {
          if (response2.error === undefined) {
            this.snackbar.openSnackbar("Removed Student");
            this.studentsInClass = this.studentsInClass.filter(student => student.user_id !== user_id);
          } else {
            this.requestService.logError(response2);
          }
        })
      }
    })
  }

  openClassPopup() {
    let dialogRef = this.dialog.open(ClassCreatorComponent, {
      width: "45%"
    })
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.snackbar.openSnackbar("Saved Class");
        this.app.spinner = true;
        this.buttonsDisabled = true;
        this.requestService.sendGetRequest("api/class/get_all_classes").then(responseClasses => {
          if (responseClasses.error === undefined) {
            this.classes = responseClasses.message
            this.filterClasses()
            this.app.spinner = false;
            this.buttonsDisabled = false;
          } else {
            this.requestService.logError(responseClasses)
            this.app.spinner = false;
            this.buttonsDisabled = false;
          }
        });
      }
    })
  }

  editTeacherPopup(updateClass) {
    let dialogRef = this.dialog.open(ChangeTeacherComponent, {
      width: "45%",
      data: updateClass
    })
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.snackbar.openSnackbar("Saved Class");
        this.app.spinner = true;
        this.buttonsDisabled = true;
        this.requestService.sendGetRequest("api/class/get_all_classes").then(responseClasses => {
          if (responseClasses.error === undefined) {
            this.classes = responseClasses.message
            this.filterClasses()
            this.app.spinner = false;
            this.buttonsDisabled = false;
          } else {
            this.requestService.logError(responseClasses)
            this.app.spinner = false;
            this.buttonsDisabled = false;
          }
        });
      }
    })
  }

  openStudentAddPopup(class_id) {
    let dialogRef = this.dialog.open(AddStudentComponent, {
      data: {students: this.studentsInClass, users: this.users.filter(user => user.role_id === 0)},
      width: "75%"
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let body = {
          "class_id": class_id,
          "user_id": result.user_id
        }
        this.requestService.sendPostRequest("api/class/add_user_to_class", body).then(response2 => {
          if (response2.error === undefined) {
            this.snackbar.openSnackbar("Added Student");
            this.studentsInClass.push(result);
          } else {
            this.requestService.logError(response2);
          }
        })
      }
    })
  }

  openUserPopup() {
    let dialogRef = this.dialog.open(UserCreatorComponent, {
      width: "45%"
    })
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.snackbar.openSnackbar("Saved User");
        this.app.spinner = true;
        this.buttonsDisabled = true;
        this.requestService.sendGetRequest("api/user/get_all_users").then(responseUsers => {
          if (responseUsers.error === undefined) {
            this.users = responseUsers.message
            this.filterUsers()
            this.app.spinner = false;
            this.buttonsDisabled = false;
          } else {
            this.requestService.logError(responseUsers)
            this.app.spinner = false;
            this.buttonsDisabled = false;
          }
        });
      }
    })
  }

  openRoomPopup() {
    let dialogRef = this.dialog.open(RoomCreatorComponent, {
      width: "45%"
    })
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.snackbar.openSnackbar("Saved Room");
        this.app.spinner = true;
        this.buttonsDisabled = true;
        this.requestService.sendGetRequest("api/room/get_all_rooms").then(responseRooms => {
          if (responseRooms.error === undefined) {
            this.rooms = responseRooms.message
            this.filterRooms()
            this.app.spinner = false;
            this.buttonsDisabled = false;
          } else {
            this.requestService.logError(responseRooms)
            this.app.spinner = false;
            this.buttonsDisabled = false;
          }
        });
      }
    })
  }

}
