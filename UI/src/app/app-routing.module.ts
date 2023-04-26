import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomepageComponent} from "./components/homepage/homepage.component";
import {ClassComponent} from "./components/class/class.component";
import {UserProfileComponent} from "./components/user-profile/user-profile.component";
import {ScheduleComponent} from "./components/schedule/schedule.component";
import {ErrorComponent} from "./components/error/error.component";
import {AdminComponent} from "./components/admin/admin.component";
import {AuthGuardService as AuthGuard} from './auth-guard.service'

const routes: Routes = [{path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomepageComponent},
  {path: 'classes', component: ClassComponent, canActivate: [AuthGuard]},
  {path: 'schedule', component: ScheduleComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: UserProfileComponent},
  {path: 'admin', component: AdminComponent, canActivate: [AuthGuard]},
  {path: '**', component: ErrorComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], exports: [RouterModule]
})
export class AppRoutingModule {
}
