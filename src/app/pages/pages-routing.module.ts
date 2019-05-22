/**
  * @license
  * Zevenet Software License
  * This file is part of the Zevenet Load Balancer software.
  *
  * Copyright (C) 2019-today ZEVENET SL, Sevilla (Spain)
  * Licensed under the terms of the GNU Affero General Public License.
  * See License.txt in the project root for license information.
**/

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from '../@core/zevenet/components/not-found/not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [{
    path: 'dashboard',
    component: DashboardComponent,
  }, {
    path: 'lslb',
    loadChildren: './lslb/lslb.module#LslbModule',
    data: {
        breadcrumbs: 'LSLB',
    },
  }, {
     path: 'dslb',
    loadChildren: './dslb/dslb.module#DslbModule',
    data: {
        breadcrumbs: 'DSLB',
    },
  }, {
    path: 'monitoring',
    loadChildren: './monitoring/monitoring.module#MonitoringModule',
    data: {
        breadcrumbs: 'Monitoring',
    },
  }, {
    path: 'network',
    loadChildren: './network/network.module#NetworkModule',
    data: {
        breadcrumbs: 'Network',
    },
  }, {
    path: 'system',
    loadChildren: './system/system.module#SystemModule',
    data: {
        breadcrumbs: 'System',
    },
  }, {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }, {
    path: '**',
    component: NotFoundComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
