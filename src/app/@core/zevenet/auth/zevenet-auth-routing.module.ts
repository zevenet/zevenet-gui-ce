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
import { RouterModule, Routes } from '@angular/router';
import { NbAuthComponent, NbLogoutComponent } from '@nebular/auth';
import { ZevenetLoginComponent } from './login/login.component';
import { AuthGuard } from '../guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: NbAuthComponent,
    children: [
      {
        path: 'login',
        // canActivate: [LoginGuard],
        component: ZevenetLoginComponent,
      },
      {
        path: 'logout',
        canActivate: [AuthGuard],
        component: NbLogoutComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZevenetAuthRoutingModule {
}
