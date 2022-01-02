import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAccordionModule, NbActionsModule, NbIconModule, NbMenuModule } from '@nebular/theme';
import { SimulatorComponent } from './simulator.component';

import { ThemeModule } from '../@theme/theme.module';
import { SimulatorRoutingModule } from './simulator-routing.module';
import { NbCardModule } from '@nebular/theme';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AngularCesiumModule, AngularCesiumWidgetsModule } from 'angular-cesium';
import { PathFinderComponent } from './path-finder/path-finder.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

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
    FormsModule,
    MatInputModule,
    MatSelectModule,
    NbActionsModule,
  ],
  bootstrap: [SimulatorComponent],
  providers: [],
})
export class SimulatorModule { }
