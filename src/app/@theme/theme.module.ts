/**
  * @license
  * Zevenet Software License
  * This file is part of the Zevenet Load Balancer software.
  *
  * Copyright (C) 2019-today ZEVENET SL, Sevilla (Spain)
  * Licensed under the terms of the GNU Affero General Public License.
  * See License.txt in the project root for license information.
**/

import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { MmcBreadcrumbsModule } from 'mmc-breadcrumbs';
import { ZevenetFooterCeComponent } from '../@core/zevenet/components/footer/zevenet-footer-ce.component';
import { RouterModule } from '@angular/router';

import {
  NbCardModule,
  NbLayoutModule,
  NbMenuModule,
  NbSidebarModule,
  NbThemeModule,
  NbCheckboxModule,
  NbPopoverModule,
  NbContextMenuModule,
  NbProgressBarModule,
  NbSelectModule,

} from '@nebular/theme';

import { CORPORATE_THEME } from './styles/theme.corporate';
import { FilterInterfacesFarm } from '../pages/pipes/filter-interfaces-farm.pipe';

const BASE_MODULES = [CommonModule,
                      FormsModule,
                      ReactiveFormsModule,
                      NgSelectModule,
                      TableModule,
                      DialogModule,
                      MmcBreadcrumbsModule,
                      RouterModule];

const NB_MODULES = [
  NbCardModule,
  NbLayoutModule,
  NbMenuModule,
  NbSidebarModule,
  NbCheckboxModule,
  NbPopoverModule,
  NbContextMenuModule,
  NgbModule,
  NbProgressBarModule,
  NbSelectModule,
];

const COMPONENTS = [
  ZevenetFooterCeComponent,
];

const PIPES = [
  FilterInterfacesFarm,
];

const NB_THEME_PROVIDERS = [
  ...NbThemeModule.forRoot(
    {
      name: 'corporate',
    },
    [ CORPORATE_THEME ],
  ).providers,
  ...NbSidebarModule.forRoot().providers,
  ...NbMenuModule.forRoot().providers,
];

@NgModule({
  imports: [...BASE_MODULES, ...NB_MODULES],
  exports: [...BASE_MODULES, ...NB_MODULES, ...COMPONENTS, ...PIPES],
  declarations: [...COMPONENTS, ...PIPES],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: ThemeModule,
      providers: [...NB_THEME_PROVIDERS],
    };
  }
}
