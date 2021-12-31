import { AfterContentInit, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';
import { Subscription } from 'rxjs';

import { Point } from '../models/path-finder';

import { PathfinderService } from '../services/pathfinder.service';
import { PointEditorObservable, Cartesian3, PointsEditorService, ViewerConfiguration, AcEntity } from 'angular-cesium';
import { convertCartesianPointsToPathFinderPoint, convertPathFinderPointsToCartesianPoints } from '../utilities/utilities';
import Entity from 'cesium/Source/DataSources/Entity';

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

  showVertexInput: boolean = true;
  showEdgesInput: boolean = false;
  showShortestDistance: boolean = false;

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

  showPoints(): void {
    this.showVertexInput = true;
    this.showEdgesInput = false;
    this.showShortestDistance = false;
  }

  showSegments(): void {
    this.showVertexInput = false;
    this.showEdgesInput = true;
    this.showShortestDistance = false;
  }

  showShortestDistanceInput(): void {
    this.showVertexInput = false;
    this.showEdgesInput = false;
    this.showShortestDistance = true;
  }

  addPoint(): void {
    let edittingEvent = this.pointEditorService.create();
    edittingEvent.subscribe(editResult => {
      if (editResult.editMode == 2) {
        console.log(editResult.position);
        let pointToAdd = convertCartesianPointsToPathFinderPoint(editResult.position, "");
        pointToAdd.alt = 5000;
        this.pathFinderService.addPoint(pointToAdd);
        edittingEvent.dispose();
      }
    });
  }

  deletePoint(name: string): void {
    this.pathFinderService.deletePoint(name);
  }

  selectPointMap(name: string): void {
    let edittingEvent = this.pointEditorService.edit(this.visualPoints.filter(elem => elem.name === name)[0].position);
    edittingEvent.subscribe(editResult => {
      if (editResult.editAction == 7) {
        let pointToEdit = convertCartesianPointsToPathFinderPoint(editResult.position, name);
        pointToEdit.alt = 5000;
        this.pathFinderService.editPointPosition(pointToEdit);
        edittingEvent.dispose();
      }
    });
  }

  ngOnDestroy(): void {
    this.pointsListChangeSubscription.unsubscribe();
  }

}
