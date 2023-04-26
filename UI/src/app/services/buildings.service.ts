import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BuildingsService {

  buildings = ["WCM", "HUM", "MIC"];

  constructor() {
  }

  getBuildings(): string[] {
    return this.buildings;
  }

  getLocation(building, room?): string {
    const warrensburg = ['WCM', 'HUM'];
    const dict = {
      'WCM': "W.C. Morris",
      'HUM': "Humphreys",
      'MIC': "Missouri Innovation Campus"
    }
    if (room === undefined) {
      return dict[building];
    } else {
      if (warrensburg.includes(building)) {
        return `At ${dict[building]} in UCM Warrensburg. Room: ${room}`
      } else {
        return `At the ${dict[building]}, in ${room}`
      }
    }
  }
}
