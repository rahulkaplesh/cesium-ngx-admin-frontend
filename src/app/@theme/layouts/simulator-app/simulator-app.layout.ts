import { AfterContentInit, Component, HostListener, OnInit } from '@angular/core';
import { ViewerConfiguration } from 'angular-cesium';

@Component({
  selector: 'ngx-simulator-app-layout',
  styleUrls: ['./simulator-app.layout.scss'],
  template: `
  <nb-layout windowMode>
    <nb-layout-header id="simulatorAppHeader" fixed>
      <ngx-header></ngx-header>
    </nb-layout-header>
    <nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive>
      <ng-content select="nb-menu"></ng-content>
    </nb-sidebar>
    <nb-layout-column class="main-content-simulator-app">
      <div [style.height.px]="cesiumMapHeight">
        <ac-map id='cesium-map'>
        </ac-map>
      </div>
      <ng-content select="router-outlet"></ng-content>
    </nb-layout-column>
  </nb-layout>
  `,
  providers: [ViewerConfiguration],
})
export class SimulatorAppLayoutComponent implements OnInit, AfterContentInit {

  cesiumMapHeight: number = 300;

  constructor(private viewerConf: ViewerConfiguration) {
    viewerConf.viewerOptions = {
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

  ngOnInit(): void { }

  ngAfterContentInit(): void {
    this.cesiumMapHeight = (window.innerHeight - document.getElementById('simulatorAppHeader').offsetHeight - 1);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.cesiumMapHeight = (window.innerHeight - document.getElementById('simulatorAppHeader').offsetHeight - 1);
  }
}