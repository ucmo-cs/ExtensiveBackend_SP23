import {Component, OnInit} from '@angular/core';
import {BuildingsService} from "../../services/buildings.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-buildings',
  templateUrl: './buildings.component.html',
  styleUrls: ['./buildings.component.scss']
})
export class BuildingsComponent implements OnInit {
  buildingSelected: string = null;
  SEL_BUILDING: string = 'Select A Building'
  buildings;

  constructor(private buildingsService: BuildingsService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.buildings = this.buildingsService.getBuildings();
    let loc = this.route.snapshot.paramMap.get('building')
    this.buildingSelected = loc === null ? this.SEL_BUILDING : loc;
  }

  getLocation(building) {
    if (building === this.SEL_BUILDING) return this.SEL_BUILDING;
    else return this.buildingsService.getLocation(building);
  }

  goBack() {
    this.buildingSelected = this.SEL_BUILDING
  }
}
