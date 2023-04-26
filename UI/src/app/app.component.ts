import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "./services/authentication.service";
import {SnackbarService} from "./services/snackbar.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  open: boolean = true;
  username: string;
  public spinner: boolean = true;
  public darkMode: boolean = true;

  constructor(private authService: AuthenticationService, public snackbar: SnackbarService) {
  }

  ngOnInit() {
    this.username = this.authService.username;
    this.darkMode = localStorage.getItem("dark-mode") != null ? localStorage.getItem("dark-mode") === "true" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (this.darkMode) {
      localStorage.setItem("dark-mode", "true")
      document.body.classList.add("dark-mode")
    } else {
      localStorage.setItem("dark-mode", "false")
      document.body.classList.remove("dark-mode")
    }
    this.spinner = false;
  }

  signInActive(): boolean {
    return window.location.href.includes('profile');
  }

  public toggleDarkMode() {
    this.darkMode = !this.darkMode;
    if (this.darkMode) {
      localStorage.setItem("dark-mode", "true")
      document.body.classList.add("dark-mode")
    } else {
      localStorage.setItem("dark-mode", "false")
      document.body.classList.remove("dark-mode")
    }
  }

}
