import {Component, OnInit} from '@angular/core';
import {RequestsService} from "../../../services/requests.service";
import {SnackbarService} from "../../../services/snackbar.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-class-creator',
  templateUrl: './user-creator.component.html',
  styleUrls: ['./user-creator.component.scss']
})
export class UserCreatorComponent implements OnInit {
  firstName;
  lastName;
  password;
  passwordConfirm;
  email;

  roleSelected;
  roles = [
    {id: 3, name: "Admin"},
    {id: 2, name: "Teacher"},
    {id: 0, name: "Student"}
  ]

  buttonsDisabled: boolean = true;

  constructor(private requestService: RequestsService, private snackbar: SnackbarService, private dialogRef: MatDialogRef<UserCreatorComponent>) {
  }

  async ngOnInit() {
    this.buttonsDisabled = false;
  }

  public submit() {
    if (this.password == this.passwordConfirm) {
      this.buttonsDisabled = true;
      this.snackbar.spinner = true;
      let body = {
        "firstname": this.firstName,
        "lastname": this.lastName,
        "user_password": this.password,
        "email": this.email,
        "role": this.roleSelected,
        "grade": 12,
      }
      this.requestService.sendPostRequest("api/user/add_user", body).then(response => {
        this.snackbar.spinner = false
        if (response.error == undefined) {
          this.dialogRef.close(true)
        } else {
          this.requestService.logError(response);
          this.buttonsDisabled = false
        }
      })
    } else {
      this.snackbar.openSnackbar("Make sure your passwords match");
      this.buttonsDisabled = false;
      this.snackbar.spinner = false;
    }
  }

}
