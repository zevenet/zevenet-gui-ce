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

import { SystemComponent } from './system.component';
import { RemoteServicesComponent } from './remote-services/remote-services.component';
import { BackupsComponent } from './backups/backups.component';
import { BackupsCreateComponent } from './backups/backups-create.component';
import { BackupsUploadComponent } from './backups/backups-upload.component';
import { UserComponent } from './user/user.component';
import { LogsComponent } from './logs/logs.component';
import { LogsViewComponent } from './logs/logs-view.component';
import { LicenseComponent } from './license/license.component';
import { SupportSaveComponent } from './support-save/support-save.component';
import { MyBreadcrumbsResolver } from '../../@core/zevenet/services/breadcrumb.resolver';

const routes: Routes = [{
  path: '',
  component: SystemComponent,
  children: [{
    path: '',
    redirectTo: 'local-services',
    pathMatch: 'full',
  },
  {
    path: 'remote-services',
    component: RemoteServicesComponent,
    data: {
      breadcrumbs: MyBreadcrumbsResolver,
      text: 'Remote Services',
    },
  }, {
    path: 'backups',
    component: SystemComponent,
    data: {
      breadcrumbs: MyBreadcrumbsResolver,
      text: 'Backups',
    },
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      }, {
        path: 'list',
        component: BackupsComponent,
      }, {
        path: 'create',
        component: BackupsCreateComponent,
        data: {
          breadcrumbs: MyBreadcrumbsResolver,
          text: 'Create',
        },
      }, {
        path: 'upload',
        component: BackupsUploadComponent,
        data: {
          breadcrumbs: MyBreadcrumbsResolver,
          text: 'Upload',
        },
      },
    ],
  },
  {
    path: 'user',
    component: UserComponent,
    data: {
      breadcrumbs: MyBreadcrumbsResolver,
      text: 'User',
    },
  }, {
    path: 'logs',
    component: SystemComponent,
    data: {
      breadcrumbs: MyBreadcrumbsResolver,
      text: 'Logs',
    },
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      }, {
        path: 'list',
        component: LogsComponent,
      }, {
        path: 'view/:name',
        component: LogsViewComponent,
        data: {
          breadcrumbs: MyBreadcrumbsResolver,
          text: 'View',
        },
      },
    ],
  },
  {
    path: 'license',
    component: LicenseComponent,
    data: {
      breadcrumbs: MyBreadcrumbsResolver,
      text: 'License',
    },
  }, {
    path: 'support-save',
    component: SupportSaveComponent,
    data: {
      breadcrumbs: MyBreadcrumbsResolver,
      text: 'Support Save',
    },
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemRoutingModule { }

export const routedComponents = [
  SystemComponent,
  RemoteServicesComponent,
  BackupsComponent,
  BackupsCreateComponent,
  BackupsUploadComponent,
  UserComponent,
  LogsComponent,
  LogsViewComponent,
  LicenseComponent,
  SupportSaveComponent,
];
