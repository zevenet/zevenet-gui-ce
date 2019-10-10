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
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/primeng';
import { ZevenetTableComponent } from './components/table/zevenet-table.component';
import { ZevenetTableEditableComponent } from './components/table/zevenet-table-editable.component';
import { ZevenetTableExpandComponent } from './components/table/zevenet-table-expand.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FilterBackendDSLB } from '../../pages/pipes/filter-backend-dslb.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NbCardModule } from '@nebular/theme';
import { ZevenetAuthService } from './auth/zevenet-auth.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
  	CommonModule,
  	MultiSelectModule,
  	TableModule,
  	DialogModule,
  	RouterModule,
  	FormsModule,
  	NgSelectModule,
  	NgbModule,
    NbCardModule,
    TranslateModule,
  ],
  declarations: [
  	ZevenetTableComponent,
  	ZevenetTableEditableComponent,
    ZevenetTableExpandComponent,
   	FilterBackendDSLB,
  ],
  exports: [
  	CommonModule,
  	ZevenetTableComponent,
  	ZevenetTableEditableComponent,
    ZevenetTableExpandComponent,
    FilterBackendDSLB,
    TranslateModule,
  ],
  providers: [
    ZevenetAuthService,
  ],
})
export class ZevenetModule { }
