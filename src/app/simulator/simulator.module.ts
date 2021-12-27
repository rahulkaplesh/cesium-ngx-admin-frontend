import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAccordionModule, NbIconModule, NbMenuModule } from '@nebular/theme';
import { SimulatorComponent } from './simulator.component';

import { ThemeModule } from '../@theme/theme.module';
import { SimulatorRoutingModule } from './simulator-routing.module';
import { NbCardModule } from '@nebular/theme';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AngularCesiumModule, AngularCesiumWidgetsModule } from 'angular-cesium';
import { PathFinderComponent } from './path-finder/path-finder.component';

@NgModule({
  declarations: [
    SimulatorComponent,
    PathFinderComponent,
  ],
  imports: [
    CommonModule,
    NbMenuModule,
    ThemeModule,
    SimulatorRoutingModule,
    NbCardModule,
    MatButtonModule,
    AngularCesiumModule.forRoot({fixEntitiesShadows: false, customPipes: []}),
    AngularCesiumWidgetsModule,
    NbIconModule,
    NbAccordionModule,
    MatInputModule,
  ],
  bootstrap: [SimulatorComponent],
})
export class SimulatorModule { }
