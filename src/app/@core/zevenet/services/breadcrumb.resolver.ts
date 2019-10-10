/**
  * @license
  * Zevenet Software License
  * This file is part of the Zevenet Load Balancer software.
  *
  * Copyright (C) 2019-today ZEVENET SL, Sevilla (Spain)
  * Licensed under the terms of the GNU Affero General Public License.
  * See License.txt in the project root for license information.
**/

import { Injectable } from '@angular/core';
import { ZevenetService } from './zevenet.service';
import { of } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { IBreadcrumb, MmcBreadcrumbsResolver } from 'mmc-breadcrumbs';

@Injectable()
export class MyBreadcrumbsResolver extends MmcBreadcrumbsResolver {

  constructor(private service: ZevenetService) {
    super();
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<IBreadcrumb[]> | Promise<IBreadcrumb[]> | Observable<any> {

    const data = route.routeConfig.data;
    const path = super.getFullPath(route);

    const text = typeof (data.breadcrumbs) === 'string' ? data.breadcrumbs : data.breadcrumbs.text || data.text;
    let title = text;

    const key = 'PAGES-MENU.' + text.toLowerCase().replace(' ', '_');
    this.service.refreshLang(key, title)
      .subscribe((langTranslated) => title = langTranslated.title);

    const crumbs: any = [{
      text: title,
      path: path,
      original: text,
    }];

    return of(crumbs);
  }
}
