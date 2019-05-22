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
import { UiSwitchModule } from 'ngx-toggle-switch';
import { ThemeModule } from '../../@theme/theme.module';
import { MonitoringRoutingModule, routedComponents } from './monitoring-routing.module';
import { FilterGraphs } from '../pipes/filter-graphs.pipe';
import { ZevenetModule } from '../../@core/zevenet/zevenet.module';
import { FilterFarmStats } from '../pipes/filter-farm-stats.pipe';
import { FilterReplaceRoot } from '../pipes/filter-replace-root.pipe';
import { NbSpinnerModule } from '@nebular/theme';
import { FilterGraphsInterfaces } from '../pipes/filter-graphs-interfaces.pipe';
import { NgChartjsModule } from 'ng-chartjs';

@NgModule({
  imports: [
    ThemeModule,
    MonitoringRoutingModule,
    UiSwitchModule,
    NgChartjsModule,
    ZevenetModule,
    NbSpinnerModule,
  ],
  declarations: [
    ...routedComponents,
    FilterGraphs,
    FilterFarmStats,
    FilterReplaceRoot,
    FilterGraphsInterfaces,
  ],
  exports: [
    FilterGraphs,
    FilterFarmStats,
    FilterReplaceRoot,
    FilterGraphsInterfaces,
  ],
})
export class MonitoringModule { }
