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
import { SystemRoutingModule, routedComponents } from './system-routing.module';
import { ZevenetModule } from '../../@core/zevenet/zevenet.module';
import { FilterNoVirtual } from '../pipes/filter-no-virtual.pipe';

@NgModule({
  imports: [
    ThemeModule,
    SystemRoutingModule,
    UiSwitchModule,
    ZevenetModule,
  ],
  declarations: [
    ...routedComponents,
    FilterNoVirtual,
  ],
})
export class SystemModule { }
