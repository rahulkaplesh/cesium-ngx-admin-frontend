import { AfterContentInit, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';
import { Subscription } from 'rxjs';

import { Point } from '../models/path-finder';

import { PathfinderService } from '../services/pathfinder.service';
import { PointEditorObservable, Cartesian3, PointsEditorService, ViewerConfiguration } from 'angular-cesium';
import { convertCartesianPointsToPathFinderPoint, convertPathFinderPointsToCartesianPoints } from '../utilities/utilities';

interface VisualPoints {
  name: string,
  position: Cartesian3
}

@Component({
  selector: 'ngx-path-finder',
  templateUrl: './path-finder.component.html',
  styleUrls: ['./path-finder.component.scss'],
  providers: [PathfinderService, PointsEditorService]
})
export class PathFinderComponent implements OnInit, AfterContentInit, OnDestroy {

  pointsList : Point[] = [];
  visualPoints: VisualPoints[] = [];
  show: boolean = true;

  cesiumMapHeight: number = 300;
  cardTopPosition: number = 86;
  padding: number = 10; // Value in pixels change at path-finder.component.scss file too !!
  cardLeftPosition: number = 90;

  pointsListChangeSubscription: Subscription = new Subscription();

  constructor(private viewerConf: ViewerConfiguration,
              iconsLibrary: NbIconLibraries, 
              private pathFinderService: PathfinderService, 
              private pointEditorService: PointsEditorService) { 
    iconsLibrary.registerFontPack('far', { packClass: 'far', iconClassPrefix: 'fa' });
    this.viewerConf.viewerOptions = {
      selectionIndicator: false,
      timeline: false,
      infoBox: false,
      fullscreenButton: false,
      baseLayerPicker: false,
      animation: false,
      shouldAnimate: false,
      homeButton: false,
      geocoder: false,
      scene3DOnly: true,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false,
      imageryProvider: new Cesium.BingMapsImageryProvider({
        url : 'https://dev.virtualearth.net',
        key: 'AmL2tQokxYaKGlIn_y1FF7eR3NsGmreYY8BiLYsCBGVYVPTksjK5j3dQg5NfGUwJ',
        mapStyle: Cesium.BingMapsStyle.AERIAL_WITH_LABELS  
      }),
    };
  }

  ngOnInit(): void {
    this.pointsListChangeSubscription = this.pathFinderService.pointsListChange.subscribe((points: Point[]) => {
      this.pointsList = points;
      this.visualPoints.splice(0, this.visualPoints.length);
      this.pointsList.forEach(point => {
        this.visualPoints.push({
          name: point.name,
          position: convertPathFinderPointsToCartesianPoints(point)
        })
      });
    });
  }

  ngAfterContentInit(): void {
    this.cesiumMapHeight = (window.innerHeight - document.getElementById('simulatorAppHeader').offsetHeight - 1);
    this.cardTopPosition = document.getElementById('simulatorAppHeader').offsetHeight + this.padding;
    this.cardLeftPosition = window.innerWidth - (document.getElementById('pathfinder-card-id').offsetWidth + this.padding);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.cesiumMapHeight = (window.innerHeight - document.getElementById('simulatorAppHeader').offsetHeight - 1);
    this.cardTopPosition = document.getElementById('simulatorAppHeader').offsetHeight + this.padding;
    this.cardLeftPosition = window.innerWidth - (document.getElementById('pathfinder-card-id').offsetWidth + this.padding);
  }

  addPoint(): void {
    this.pathFinderService.addPoint();
  }

  deletePoint(name: string): void {
    this.pathFinderService.deletePoint(name);
  }

  selectPointMap(name: string): void {
    //let pointWorking = this.visualPoints.filter(elem => elem.point.name === name)[0];
    //console.log(pointWorking);
    //pointWorking.editingEvent = this.pointEditorService.edit(convertPathFinderPointsToCartesianPoints(pointWorking.point));
  }

  ngOnDestroy(): void {
    this.pointsListChangeSubscription.unsubscribe();
  }

}
