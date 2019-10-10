/**
  * @license
  * Zevenet Software License
  * This file is part of the Zevenet Load Balancer software.
  *
  * Copyright (C) 2019-today ZEVENET SL, Sevilla (Spain)
  * Licensed under the terms of the GNU Affero General Public License.
  * See License.txt in the project root for license information.
**/

import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MmcBreadcrumbsComponent } from 'mmc-breadcrumbs';

@Component({
  selector: 'zevenet-breadcrumbs',
  template: `
    <ng-container>
      <mmc-breadcrumbs #breadc></mmc-breadcrumbs>
    </ng-container>`,
})
export class ZevenetBreadcrumbsComponent {

  @ViewChild('breadc') breadc: MmcBreadcrumbsComponent;

  constructor(public translate: TranslateService) {
    this.translate.onLangChange.subscribe((event: any) => {
      this.translate.get('PAGES-MENU')
      .subscribe((langTranslated) => {
        this.breadc.crumbs.map((crumb) => {
          const key = (<any>crumb).original.toLowerCase().replace(' ', '_');
          const translated_text = langTranslated[key].title;
          crumb.text = translated_text;
        });
      });
    });
  }
}
