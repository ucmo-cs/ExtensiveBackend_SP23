import {AuthenticationService} from "../../services/authentication.service";
import {Component, OnInit} from '@angular/core';
import {AppComponent} from "../../app.component";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  hovered: boolean = false;

  pages = [
    {name: "home", icon: "home"}
  ]

  constructor(public AppComponent: AppComponent,
              public authService: AuthenticationService,
              public appComponent: AppComponent) {
  }

  ngOnInit() {
    this.update()
  }

  active(location: string): boolean {
    let loc = window.location.href.replace(/https?:\/\//, '');
    if (location == 'home' && loc.indexOf('/') == loc.length - 1) {
      return true;
    }
    return window.location.href.includes(location);
  }

  update() {
    const student = {name: "student", icon: "person"};
    const classes = {name: "classes", icon: "edit"};
    const schedule = {name: "schedule", icon: "calendar_month"};
    const error = {name: "error", icon: "error"}
    switch (this.authService.role) {
      case null:
      case undefined:
        break;
      case "admin":
        this.pages.push({name: "admin", icon: "admin_panel_settings"}, classes)
        break;
      case "guardian":
        this.pages.push(student);
        break;
      case "student":
      case "teacher":
        this.pages.push(classes)
        break;
      default:
        alert("something is broken, no role found");
    }
  }
}
