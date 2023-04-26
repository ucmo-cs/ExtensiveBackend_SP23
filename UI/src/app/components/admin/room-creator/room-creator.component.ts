import {Component, OnInit} from '@angular/core';
import {RequestsService} from "../../../services/requests.service";
import {SnackbarService} from "../../../services/snackbar.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-class-creator',
  templateUrl: './room-creator.component.html',
  styleUrls: ['./room-creator.component.scss']
})
export class RoomCreatorComponent implements OnInit {
  roomName;
  width;
  length;

  buttonsDisabled: boolean = true;

  constructor(private requestService: RequestsService, private snackbar: SnackbarService, private dialogRef: MatDialogRef<RoomCreatorComponent>) {
  }

  async ngOnInit() {
    this.buttonsDisabled = false;
  }

  public submit() {
    this.buttonsDisabled = true;
    this.snackbar.spinner = true;
    let body = {
      "room_name": this.roomName,
      "room_width": this.width,
      "room_length": this.length
    }
    this.requestService.sendPostRequest("api/room/add_room", body).then(response => {
      this.snackbar.spinner = false
      if (response.error === undefined) {
        this.dialogRef.close(true)
      } else {
        this.requestService.logError(response)
        this.buttonsDisabled = false;
      }
    })

  }

}
