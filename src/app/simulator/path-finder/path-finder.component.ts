import { AfterContentInit, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';
import { Subscription } from 'rxjs';

import { Point, Edge } from '../models/path-finder';

import { PathfinderService } from '../services/pathfinder.service';
import { Cartesian3, PointsEditorService, ViewerConfiguration, PolylinesEditorService } from 'angular-cesium';
import { convertCartesianPointsToPathFinderPoint, convertPathFinderPointsToCartesianPoints } from '../utilities/utilities';
import Entity from 'cesium/Source/DataSources/Entity';
import { point } from 'leaflet';
import { saveAs } from 'file-saver';

interface VisualPoints {
  name: string,
  position: Cartesian3
}

interface VisualEdges {
  name: string,
  positions: Cartesian3[]
}

export interface DataStructure {
  points: Point[],
  edges: Edge[],
  startPoint: Point,
  endPoint: Point
}

@Component({
  selector: 'ngx-path-finder',
  templateUrl: './path-finder.component.html',
  styleUrls: ['./path-finder.component.scss'],
  providers: [PathfinderService, PointsEditorService, PolylinesEditorService]
})
export class PathFinderComponent implements OnInit, AfterContentInit, OnDestroy {

  startPoint: Point;
  endPoint: Point;

  cesiumLineMaterial = new Cesium.PolylineGlowMaterialProperty({
    glowPower: 0.2,
    color: Cesium.Color.CORNFLOWERBLUE
  });

  showVertexInput: boolean = true;
  showEdgesInput: boolean = false;
  showShortestDistance: boolean = false;

  edgesList: Edge[] = [];
  visualEdges: VisualEdges[] = [];

  pointsList : Point[] = [];
  visualPoints: VisualPoints[] = [];
  show: boolean = true;

  resultEdges: Edge[] = [];
  distanceCovered: number;

  cesiumMapHeight: number = 300;
  cardTopPosition: number = 86;
  padding: number = 10; // Value in pixels change at path-finder.component.scss file too !!
  cardLeftPosition: number = 90;

  pointsListChangeSubscription: Subscription = new Subscription();
  edgesListChangeSubscription: Subscription = new Subscription();

  allowPointAdditionToEdge: boolean = false;

  constructor(private viewerConf: ViewerConfiguration,
              iconsLibrary: NbIconLibraries, 
              private pathFinderService: PathfinderService, 
              private pointEditorService: PointsEditorService,
              private polylinesEditorService: PolylinesEditorService) { 
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
      this.startPoint = this.pointsList[0];
      this.endPoint = this.pointsList[1];
      this.visualPoints.splice(0, this.visualPoints.length);
      this.pointsList.forEach(point => {
        this.visualPoints.push({
          name: point.name,
          position: convertPathFinderPointsToCartesianPoints(point)
        })
      });
    });
    this.edgesListChangeSubscription = this.pathFinderService.edgesListChange.subscribe((edges: Edge[]) => {
      this.edgesList = edges;
      this.visualEdges.splice(0, this.visualEdges.length);
      this.edgesList.forEach(edge => {
        this.visualEdges.push({
          name: edge.name,
          positions: [convertPathFinderPointsToCartesianPoints(edge.source), convertPathFinderPointsToCartesianPoints(edge.target)]
        });
      });
    })
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
    this.edgesList.filter(edge => edge.source.name === name || edge.target.name === name).forEach(edge => {
      this.pathFinderService.removeEdge(edge.name);
    })
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

  addEdge(): void {
    if (this.pointsList.length > 1) {
      this.pathFinderService.addEdge(this.pointsList[0], this.pointsList[1]);
    } else {
      console.log("!Too few points error!");
    }
  }

  updateEdge(name: string) {
    let edgeToBeEdited = this.edgesList.filter(edge => edge.name === name)[0];
    this.pathFinderService.editEdgePositions(edgeToBeEdited);
  }

  deleteEdge(name: string) {
    this.pathFinderService.removeEdge(name);
  }

  exportData() {
    let dataStructureExport: DataStructure = {
      points: this.pointsList,
      edges: this.edgesList,
      startPoint: this.startPoint,
      endPoint: this.endPoint
    }
    let blob = new Blob([JSON.stringify(dataStructureExport, null, 2)], {type: "text/plain;charset=utf-8"});
    saveAs(blob, 'Scenario.txt');
  }

  importData() {
    document.getElementById('file-upload').click();
  }

  loadScenario(event: Event) {
    console.log(event);
    let input = event.target;
    console.log(input);

    let reader: FileReader = new FileReader();
    reader.onload = () => {
      let inputTxt = reader.result;
      let data: DataStructure = JSON.parse(inputTxt as string);
      this.pathFinderService.updateData(data.points, data.edges);
      this.startPoint = data.startPoint;
      this.endPoint = data.endPoint;
    }
    //@ts-ignore
    reader.readAsText(input.files[0]);
  }

  computeShortestPath() {
    let dataToSend: DataStructure = {
      points: this.pointsList,
      edges: this.edgesList,
      startPoint: this.startPoint,
      endPoint: this.endPoint
    };
    this.pathFinderService.computeShortestPath(dataToSend)
      .subscribe(result => {
        console.log(result);
      });
  }

  ngOnDestroy(): void {
    this.pointsListChangeSubscription.unsubscribe();
    this.edgesListChangeSubscription.unsubscribe();
  }

}
