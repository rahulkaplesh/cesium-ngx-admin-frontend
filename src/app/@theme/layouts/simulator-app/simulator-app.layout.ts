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
      <ng-content select="router-outlet"></ng-content>
    </nb-layout-column>
  </nb-layout>
  `,
  providers: [ViewerConfiguration],
})
export class SimulatorAppLayoutComponent implements OnInit{

  constructor(private viewerConf: ViewerConfiguration) { }

  ngOnInit(): void { }

  ngAfterContentInit(): void { }
}