/**
  * @license
  * Zevenet Software License
  * This file is part of the Zevenet Load Balancer software.
  *
  * Copyright (C) 2019-today ZEVENET SL, Sevilla (Spain)
  * Licensed under the terms of the GNU Affero General Public License.
  * See License.txt in the project root for license information.
**/

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MonitoringComponent } from './monitoring.component';
import { GraphsComponent } from './graphs/graphs.component';
import { FarmguardiansComponent } from './farmguardians/farmguardians.component';
import { FarmguardiansCreateComponent } from './farmguardians/farmguardians-create.component';
import { FarmguardiansUpdateComponent } from './farmguardians/farmguardians-update.component';
import { StatsComponent } from './stats/stats.component';

const routes: Routes = [{
  path: '',
  component: MonitoringComponent,
  children: [{
    path: '',
    redirectTo: 'graphs',
    pathMatch: 'full',
  },
  {
      path: 'graphs',
      component: GraphsComponent,
      data: {
        breadcrumbs: 'Graphs',
      },
    }, {
      path: 'stats',
      component: StatsComponent,
      data: {
        breadcrumbs: 'Stats',
      },
    }, {
      path: 'farmguardians',
      component: MonitoringComponent,
      data: {
        breadcrumbs: 'Farmguardians',
      },
      children: [
        {
          path: '',
          redirectTo: 'list',
          pathMatch: 'full',
        }, {
          path: 'list',
          component: FarmguardiansComponent,
        }, {
          path: 'create',
          component: FarmguardiansCreateComponent,
          data: {
            breadcrumbs: 'Create',
          },
        }, {
          path: 'edit/:name',
          component: FarmguardiansUpdateComponent,
          data: {
            breadcrumbs: 'Edit',
          },
        },
      ],
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonitoringRoutingModule { }

export const routedComponents = [
  MonitoringComponent,
  GraphsComponent,
  FarmguardiansComponent,
  FarmguardiansCreateComponent,
  FarmguardiansUpdateComponent,
  StatsComponent,
];
