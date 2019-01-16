/**
  * @license
  * Zevenet Software License
  * This file is part of the Zevenet Load Balancer software.
  *
  * Copyright (C) 2019-today ZEVENET SL, Sevilla (Spain)
  * Licensed under the terms of the GNU Affero General Public License.
  * See License.txt in the project root for license information.
**/

import { Component } from '@angular/core';

@Component({
  selector: 'zevenet-layout',
  styleUrls: ['./zevenet.layout.scss'],
  template: `
    <nb-layout windowMode>
      <nb-sidebar class="menu-sidebar"
                   tag="menu-sidebar">
        <div class="h-100 d-flex flex-column">
          <a href="https://www.zevenet.com" target="_blank">
            <img src="assets/Zevenet_Logo.png" alt="Zevenet Logo" id="zevenet-logo" />
          </a>
          <ng-content select="nb-menu"></ng-content>
          <zevenet-footer-ce class="mt-auto pb-4 pt-5"></zevenet-footer-ce>
        </div>
      </nb-sidebar>

      <nb-layout-column class="main-content">
        <mmc-breadcrumbs></mmc-breadcrumbs>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>
    </nb-layout>
  `,
})
export class ZevenetLayoutComponent {
}
