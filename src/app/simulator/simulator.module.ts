import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbMenuModule } from '@nebular/theme';
import { SimulatorComponent } from './simulator.component';

import { ThemeModule } from '../@theme/theme.module';
import { SimulatorRoutingModule } from './simulator-routing.module';
import { NbCardModule } from '@nebular/theme';

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
    AngularCesiumModule.forRoot({fixEntitiesShadows: false, customPipes: []}),
    AngularCesiumWidgetsModule,
  ],
  bootstrap: [SimulatorComponent],
})
export class SimulatorModule { }
