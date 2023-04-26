import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from "./services/authentication.service";

@Injectable()
export class AuthGuardService {
  constructor(public auth: AuthenticationService, public router: Router) {
  }

  canActivate(): boolean {
    if (!this.auth.username) {
      this.router.navigate(['profile']);
      return false;
    }
    return true;
  }
}
