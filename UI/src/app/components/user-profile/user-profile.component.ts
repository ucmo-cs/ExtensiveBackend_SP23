import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {RequestsService} from "../../services/requests.service";
import {SnackbarService} from "../../services/snackbar.service";
import {HttpClient} from "@angular/common/http";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {AppComponent} from "../../app.component";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  username: string = '';
  id: number = 0;
  password: string = '';
  role: string = '';
  signedIn: boolean = false;
  classesTaught: any[] = [];
  buttonsDisabled: boolean = false;

  constructor(private sidebar: SidebarComponent, private authService: AuthenticationService, private requestService: RequestsService, private snackBar: SnackbarService, private http: HttpClient, private app: AppComponent) {
  }

  ngOnInit() {
    this.signIn()
  }

  signIn() {
    this.username = this.authService.username;
    this.role = this.authService.role;
    this.id = this.authService.id;
    this.signedIn = this.authService.username != null;
    this.buttonsDisabled = false;
    this.app.spinner = false;
  }

  async submit() {
    this.buttonsDisabled = true;
    this.app.spinner = true;
    if (!this.username || this.username.length < 4) {
      this.snackBar.openSnackbar("Username must have at least 4 characters")
      this.buttonsDisabled = false;
      this.app.spinner = false;
    } else if (!this.password || this.password.length < 4) {
      this.snackBar.openSnackbar("Password must have at least 4 characters");
      this.buttonsDisabled = false;
      this.app.spinner = false;
    } else {
      let credentials = {
        username: this.username,
        password: this.password
      }
      this.requestService.sendGetRequest(`api/generic/login?username=${credentials.username}&password=${credentials.password}`).then(response => {
          if (response.error == undefined) {
            switch (response.user.role_id) {
              case 0:
                localStorage.setItem("user", JSON.stringify({
                  username: credentials.username,
                  name: response.user.first_name + " " + response.user.last_name,
                  role: "student",
                  id: response.user.user_id
                }));
                break;
              case 1:
                localStorage.setItem("user", JSON.stringify({
                  username: credentials.username,
                  name: response.user.first_name + " " + response.user.last_name,
                  role: "parent",
                  id: response.user.user_id
                }));
                break;
              case 2:
                localStorage.setItem("user", JSON.stringify({
                  username: credentials.username,
                  name: response.user.first_name + " " + response.user.last_name,
                  role: "teacher",
                  id: response.user.user_id
                }));
                break;
              case 3:
                localStorage.setItem("user", JSON.stringify({
                  username: credentials.username,
                  name: response.user.first_name + " " + response.user.last_name,
                  role: "admin",
                  id: response.user.user_id
                }));
                break;
              default:
                this.snackBar.openSnackbar("Invalid login info");
                this.buttonsDisabled = false;
                this.app.spinner = false;
                return;
            }
            this.buttonsDisabled = false;
            this.app.spinner = false;
            location.reload()
          } else {
            this.requestService.logError(response)
            this.buttonsDisabled = false;
            this.app.spinner = false;
          }
        }
      )
    }
  }

  signOut() {
    const darkMode = localStorage.getItem("dark-mode");
    localStorage.clear();
    location.reload();
    localStorage.setItem("dark-mode", darkMode);
  }
}
