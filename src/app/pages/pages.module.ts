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
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { ToBooleanPipe } from './pipes/to-boolean.pipe';
import { ZevenetService } from '../@core/zevenet/services/zevenet.service';
import { NotFoundComponent } from '../@core/zevenet/components/not-found/not-found.component';
import { ZevenetLayoutComponent } from '../@theme/layout/zevenet.layout';
import { ZevenetBreadcrumbsComponent } from '../@theme/layout/breadcrumbs/zevenet-breadcrumbs.component';
import { TranslateService } from '@ngx-translate/core';

const PAGES_COMPONENTS = [
  PagesComponent,
  NotFoundComponent,
  ZevenetLayoutComponent,
  ZevenetBreadcrumbsComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    UiSwitchModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
    ToBooleanPipe,
  ],
  providers: [
    ToBooleanPipe,
    ZevenetService,
    TranslateService,
  ],
})
export class PagesModule {
}
