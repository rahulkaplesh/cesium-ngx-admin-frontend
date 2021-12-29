import { AfterContentInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';
import Entity from 'cesium/Source/DataSources/Entity';
import { Subscription } from 'rxjs';

import { Point } from '../models/path-finder';

import { PathfinderService } from '../services/pathfinder.service';
import { CesiumService, MapEventsManagerService, PointsEditorService, } from 'angular-cesium';

@Component({
  selector: 'ngx-path-finder',
  templateUrl: './path-finder.component.html',
  styleUrls: ['./path-finder.component.scss'],
  providers: [PathfinderService, PointsEditorService, MapEventsManagerService, CesiumService]
})
export class PathFinderComponent implements OnInit, AfterContentInit, OnDestroy {


  pointsList : Point[] = [];
  entities: Entity[] = [];

  cardTopPosition: number = 86;
  padding: number = 10; // Value in pixels change at path-finder.component.scss file too !!
  cardLeftPosition: number = 90;

  pointsListChangeSubscription: Subscription = new Subscription();

  constructor(iconsLibrary: NbIconLibraries, private pathFinderService: PathfinderService) { 
    iconsLibrary.registerFontPack('far', { packClass: 'far', iconClassPrefix: 'fa' });
  }

  ngOnInit(): void {
    this.pointsListChangeSubscription = this.pathFinderService.pointsListChange.subscribe((points: Point[]) => {
      this.pointsList = points;
      this.entities = points.map(elem => {
        return {
          id: elem.name,
          position: Cesium.Cartesian3.fromDegrees(elem.lon, elem.lat, elem.alt)
        };
      })
    });
  }

  ngAfterContentInit(): void {
    this.cardTopPosition = document.getElementById('simulatorAppHeader').offsetHeight + this.padding;
    this.cardLeftPosition = window.innerWidth - (document.getElementById('pathfinder-card-id').offsetWidth + this.padding);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.cardTopPosition = document.getElementById('simulatorAppHeader').offsetHeight + this.padding;
    this.cardLeftPosition = window.innerWidth - (document.getElementById('pathfinder-card-id').offsetWidth + this.padding);
  }

  addPoint(): void {
    this.pathFinderService.addPoint();
  }

  deletePoint(name: string): void {
    this.pathFinderService.deletePoint(name);
  }

  ngOnDestroy(): void {
    this.pointsListChangeSubscription.unsubscribe();
  }

}
