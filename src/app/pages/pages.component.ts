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
import {ViewEncapsulation} from '@angular/core';
import { MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'zevenet-pages',
  template: `
    <zevenet-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </zevenet-layout>
  `,
  styleUrls: ['./pages.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PagesComponent {

  constructor() {
  }

  menu = MENU_ITEMS;
}
