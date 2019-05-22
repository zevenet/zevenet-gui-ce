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
import {TranslateService} from '@ngx-translate/core';
import {LangChangeEvent} from '@ngx-translate/core';

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

  value: any;
  menu: any = MENU_ITEMS;
  sorted: any = ['dashboard', 'lslb', 'lslb_farms', 'ssl', 'dslb', 'dslb_farms',
  'monitoring', 'graphs', 'farm_stats', 'farmguardians', 'network',
  'nic', 'vlan', 'virtual_interfaces', 'gateway', 'system', 'remote_services',
  'backups', 'user', 'logs', 'license', 'support_save'];

  constructor(public translate: TranslateService) {
    translate.setDefaultLang('en');
    this.refreshLang();

    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.refreshLang();
    });
  }

  refreshLang(): void {
    this.translate.get('PAGES-MENU').subscribe((valor) => {
      this.value = valor;
      let ind = 0;
      this.menu.forEach((element, index) => {
        element.title = this.value[this.sorted[ind]].title;
        if (element.children) {
          element.children.forEach((child, childindex) => {
            ind++;
            child.title = this.value[this.sorted[ind]].title;
          });
        }
        ind++;
      });
    });
  }
}


