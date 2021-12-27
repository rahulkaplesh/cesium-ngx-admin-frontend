import { AfterContentInit, Component, HostListener, OnInit } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';

@Component({
  selector: 'ngx-path-finder',
  templateUrl: './path-finder.component.html',
  styleUrls: ['./path-finder.component.scss']
})
export class PathFinderComponent implements OnInit, AfterContentInit {

  cardTopPosition: number = 86;
  padding: number = 10; // Value in pixels change at path-finder.component.scss file too !!
  cardLeftPosition: number = 90;

  constructor(iconsLibrary: NbIconLibraries) { 
    iconsLibrary.registerFontPack('far', { packClass: 'far', iconClassPrefix: 'fa' });
  }

  ngOnInit(): void {
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

}
