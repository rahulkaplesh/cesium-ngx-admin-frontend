import { Component, OnInit } from '@angular/core';

import { MENU_ITEMS } from './simulator-menu';



@Component({
  selector: 'ngx-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.scss'],

})
export class SimulatorComponent implements OnInit {

  menu = MENU_ITEMS;

  constructor() { 
    
  }

  ngOnInit(): void {
  }

}
