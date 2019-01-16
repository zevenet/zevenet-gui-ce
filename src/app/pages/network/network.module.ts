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
import { ThemeModule } from '../../@theme/theme.module';
import { NetworkRoutingModule, routedComponents } from './network-routing.module';
import { FilterVlanCreate } from '../pipes/filter-vlan-create.pipe';
import { FilterVirtualCreate } from '../pipes/filter-virtual-create.pipe';
import { FilterGateway } from '../pipes/filter-gateway.pipe';
import { ZevenetModule } from '../../@core/zevenet/zevenet.module';

@NgModule({
  imports: [
    ThemeModule,
    NetworkRoutingModule,
    ZevenetModule,
  ],
  declarations: [
    ...routedComponents,
    FilterVlanCreate,
    FilterVirtualCreate,
    FilterGateway,
  ],
  exports: [
    FilterVlanCreate,
    FilterVirtualCreate,
    FilterGateway,
  ],
})
export class NetworkModule { }
