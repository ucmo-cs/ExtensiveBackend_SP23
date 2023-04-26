import {Component, OnInit} from '@angular/core';
import {SnackbarService} from "../../services/snackbar.service";

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  constructor(private snackbar: SnackbarService) {
  }

  ngOnInit(): void {
    this.snackbar.openSnackbar("WHY ARE YOU HERE");
  }

}
