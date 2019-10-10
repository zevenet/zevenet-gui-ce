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
import { ViewEncapsulation } from '@angular/core';
import { MENU_ITEMS } from './pages-menu';
import { TranslateService } from '@ngx-translate/core';
import { LangChangeEvent } from '@ngx-translate/core';
import { isObject } from 'util';

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
  menu: any = [];
  menu_struct: any = MENU_ITEMS;

  constructor(public translate: TranslateService) {
    this.refreshLangMenu();
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.refreshLangMenu();
    });
    translate.onDefaultLangChange.subscribe((event: LangChangeEvent) => {
      this.refreshLangMenu();
    });
  }

  refreshLangMenu(): void {
    this.menu_struct.forEach((x, index) => {
      this.menu[index] = Object.assign({}, x);
      if (x.children) {
        const children = [];
        x.children.forEach((child, ind) =>  {
          children[ind] = Object.assign({}, child);
        });
        this.menu[index].children = children;
      }
    });

    this.translate.get('PAGES-MENU').subscribe((valor) => {
      this.value = valor;
      if (isObject(this.value))
        this.menu.forEach((element, index) => {
          const item = element.title.toLowerCase().replace(' ', '_');
          element.title = this.value[item].title;
          if (element.children) {
            element.children.forEach((child, childindex) => {
              const subitem = child.title.toLowerCase().replace(' ', '_');
              child.title = this.value[subitem].title;
            });
          }
        });
    });
  }
}


