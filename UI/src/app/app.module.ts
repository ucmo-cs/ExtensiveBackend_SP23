import {NgModule} from "@angular/core";
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import {AppComponent} from "./app.component";
import {HomepageComponent} from "./components/homepage/homepage.component";
import {ClassComponent} from "./components/class/class.component";
import {UserProfileComponent} from "./components/user-profile/user-profile.component";
import {ScheduleComponent} from "./components/schedule/schedule.component";
import {BuildingsComponent} from "./components/buildings/buildings.component";
import {ErrorComponent} from "./components/error/error.component";
import {TeacherComponent} from "./components/teacher/teacher.component";
import {AdminComponent} from "./components/admin/admin.component";
import {BrowserModule} from "@angular/platform-browser";
import {MatSidenavModule} from "@angular/material/sidenav";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {RouterModule} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import {MatListModule} from "@angular/material/list";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FullCalendarModule} from "@fullcalendar/angular";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {HttpClientModule} from "@angular/common/http";
import {MatTabsModule} from "@angular/material/tabs";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatCardModule} from "@angular/material/card";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatChipsModule} from "@angular/material/chips";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {RequestsService} from "./services/requests.service";
import {MatSelectModule} from "@angular/material/select";
import {MatDialogModule} from "@angular/material/dialog";
import {ClassCreatorComponent} from "./components/admin/class-creator/class-creator.component";
import {UserCreatorComponent} from "./components/admin/user-creator/user-creator.component";
import {RoomCreatorComponent} from "./components/admin/room-creator/room-creator.component";
import {ChangeTeacherComponent} from "./components/admin/change-teacher/change-teacher.component";
import {AddStudentComponent} from './components/admin/add-student/add-student.component';
import {ConfirmDeleteComponent} from './components/admin/confirm-delete/confirm-delete.component'
import {AuthGuardService} from "./auth-guard.service";
import {StudentComponent} from "./components/student/student.component";


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HomepageComponent,
    ClassComponent,
    UserProfileComponent,
    ScheduleComponent,
    BuildingsComponent,
    ErrorComponent,
    TeacherComponent,
    AdminComponent,
    ClassCreatorComponent,
    UserCreatorComponent,
    RoomCreatorComponent,
    ChangeTeacherComponent,
    AddStudentComponent,
    ConfirmDeleteComponent,
    StudentComponent
  ],
  imports: [
    BrowserModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    AppRoutingModule,
    MatListModule,
    MatFormFieldModule,
    FullCalendarModule,
    MatInputModule,
    FormsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    HttpClientModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatCardModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDialogModule

  ],
  providers: [RequestsService, SidebarComponent, AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
