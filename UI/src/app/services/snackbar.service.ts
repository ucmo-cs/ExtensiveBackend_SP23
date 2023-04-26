import {Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";


@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  public spinner = false;
  DURATION = 5000;

  constructor(private snackBar: MatSnackBar) {
  }

  openSnackbar(message: string) {
    if (message != null && message.trim() != "") {
      this.snackBar.open(message, "X", {
        duration: this.DURATION,
        horizontalPosition: "right",
        verticalPosition: "top"
      });
    }
  }
}
