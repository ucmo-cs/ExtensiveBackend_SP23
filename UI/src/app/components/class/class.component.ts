import {Component, OnInit} from '@angular/core';
import {BuildingsService} from "../../services/buildings.service";
import {AuthenticationService} from "../../services/authentication.service";
import {RequestsService} from "../../services/requests.service";
import {AppComponent} from "../../app.component";

@Component({
  selector: 'app-class', templateUrl: './class.component.html', styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit {
  classes: any[];
  classes_filtered: any[];
  buttonsDisabled: boolean = true;
  role;

  constructor(public buildingsService: BuildingsService, public authService: AuthenticationService, private requestService: RequestsService,
              private app: AppComponent) {
  }

  ngOnInit() {
    this.app.spinner = true;
    this.role = this.authService.role;

    if (this.role === "teacher" || this.role === "student") {

      let body = {"user_id": this.authService.id}
      this.requestService.sendGetRequest(`api/user/get_all_classes_from_user`, body).then(response => this.next(response));
    } else {
      this.requestService.sendGetRequest(`api/class/get_all_classes`).then(response => this.next(response));
    }
  }

  next(response: any) {
    if (response.error === undefined) {
      if (this.authService.role === "teacher") {
        this.requestService.sendGetRequest('api/user/get_all_users?role_id=2').then(response2 => {
          if (response2.error === undefined) {
            this.classes = response.message
            this.classes_filtered = this.classes.sort((course1, course2) => parseInt(course1.hour) - parseInt(course2.hour));
          } else {
            this.requestService.logError(response2)
          }
        });
      } else {
        this.classes = response.message;
        this.classes_filtered = this.classes.sort((course1, course2) => parseInt(course1.hour) - parseInt(course2.hour));
      }
      this.buttonsDisabled = false;
      this.app.spinner = false;
    } else {
      this.requestService.logError(response)
      this.buttonsDisabled = false;
      this.app.spinner = false;
    }
  }
}
