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
import { LslbRoutingModule, routedComponents } from './lslb-routing.module';
import { FilterCertsFarm } from '../pipes/filter-certs-farm.pipe';
import { ZevenetModule } from '../../@core/zevenet/zevenet.module';
import { FilterReplaceUnderscorePipe } from '../pipes/filter-replace-underscore.pipe';

@NgModule({
  imports: [
    ThemeModule,
    LslbRoutingModule,
    UiSwitchModule,
    ZevenetModule,
  ],
  declarations: [
    ...routedComponents,
    FilterCertsFarm,
    FilterReplaceUnderscorePipe,
  ],
  exports: [
    FilterCertsFarm,
    FilterReplaceUnderscorePipe,
  ],
})
export class LslbModule { }
