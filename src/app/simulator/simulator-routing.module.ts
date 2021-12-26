import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimulatorComponent } from './simulator.component';

import { PathFinderComponent } from './path-finder/path-finder.component';

const routes: Routes = [{
    path: '',
    component: SimulatorComponent,
    children:[
      {
        path: 'pathfinder',
        component: PathFinderComponent
      },
      {
        path: '',
        redirectTo: 'pathfinder',
        pathMatch: 'full',
      }
    ]
  }];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class SimulatorRoutingModule { }
