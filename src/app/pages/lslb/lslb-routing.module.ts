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

import { LslbComponent } from './lslb.component';
import { FarmsComponent } from './farms/farms.component';
import { FarmsUpdateComponent } from './farms/farms-update.component';
import { FarmsCreateComponent } from './farms/farms-create.component';
import { ServiceUpdateComponent } from './farms/service-update.component';
import { CertificatesComponent } from './certificates/certificates.component';
import { CertificatesUploadComponent } from './certificates/certificates-upload.component';
import { CertificatesCsrComponent } from './certificates/certificates-csr.component';

const routes: Routes = [{
  path: '',
  component: LslbComponent,
  children: [{
    path: '',
    redirectTo: 'farms',
    pathMatch: 'full',
  },
  {
    path: 'farms',
    component: LslbComponent,
    data: {
      breadcrumbs: 'Farms',
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
          breadcrumbs: 'Create',
        },
      }, {
        path: 'edit/:name',
        component: FarmsUpdateComponent,
        data: {
          breadcrumbs: 'Edit',
        },
      },
    ],
  },
  {
    path: 'certificates',
    component: LslbComponent,
    data: {
      breadcrumbs: 'Certificates',
    },
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: CertificatesComponent,
      },
      {
        path: 'upload',
        component: CertificatesUploadComponent,
        data: {
          breadcrumbs: 'Upload',
        },
      },
      {
        path: 'csr',
        component: CertificatesCsrComponent,
        data: {
          breadcrumbs: 'Genereate CSR',
        },
      },
    ],
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LslbRoutingModule { }

export const routedComponents = [
  LslbComponent,
  FarmsComponent,
  FarmsUpdateComponent,
  ServiceUpdateComponent,
  FarmsCreateComponent,
  CertificatesComponent,
  CertificatesUploadComponent,
  CertificatesCsrComponent,
];
