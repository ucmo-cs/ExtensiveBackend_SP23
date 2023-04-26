import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public username: string;
  public role: string;
  public id: number;
  public userid: string;

  constructor() {
    this.update()
  }

  update() {
    if (localStorage.getItem("user")) {
      let user = JSON.parse(localStorage.getItem("user"));
      this.username = user.name;
      this.userid = user.username;
      this.role = user.role;
      this.id = user.id;
    }
  }

}
