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

import { DslbComponent } from './dslb.component';
import { FarmsComponent } from './farms/farms.component';
import { FarmsUpdateComponent } from './farms/farms-update.component';
import { FarmsCreateComponent } from './farms/farms-create.component';
import { MyBreadcrumbsResolver } from '../../@core/zevenet/services/breadcrumb.resolver';

const routes: Routes = [{
  path: '',
  component: DslbComponent,
  children: [{
    path: '',
    redirectTo: 'farms',
    pathMatch: 'full',
  },
  {
    path: 'farms',
    component: DslbComponent,
    data: {
      breadcrumbs: MyBreadcrumbsResolver,
      text: 'Farms',
    },
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      }, {
        path: 'list',
        component: FarmsComponent,
      }, {
        path: 'create',
        component: FarmsCreateComponent,
        data: {
          breadcrumbs: MyBreadcrumbsResolver,
          text: 'Create',
        },
      }, {
        path: 'edit/:name',
        component: FarmsUpdateComponent,
        data: {
          breadcrumbs: MyBreadcrumbsResolver,
          text: 'Edit',
        },
      },
    ],
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DslbRoutingModule { }

export const routedComponents = [
  DslbComponent,
  FarmsComponent,
  FarmsUpdateComponent,
  FarmsCreateComponent,
];
