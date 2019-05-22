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
import { ZevenetAuthService } from '../../auth/zevenet-auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'zevenet-footer-ce',
  template: `
    <hr/>
    <nb-select class="selectedlang" placeholder="Select Showcase" [(selected)]="selectedLang"
    (selectedChange)="changeLang()">
      <nb-option value="en">English</nb-option>
      <nb-option value="es">Español</nb-option>
    </nb-select>
    <div class="footer pt-3">
      <span *ngIf="zevenetAuthService?.hostname" class="pl-3"><i class="fa fa-desktop footer">
        </i> {{zevenetAuthService.hostname}}
      </span>
      <a *ngIf="zevenetAuthService?.token" class="nav-link" href="#" id="logout"
      [routerLink]="['/auth/logout']" (click)="removeHost()">
        <i class="fa fa-sign-out-alt footer"></i> Logout ({{zevenetAuthService.token}})
      </a>
    </div>
  `,
})
export class ZevenetFooterCeComponent {

  selectedLang: string = 'en';


  constructor(public zevenetAuthService: ZevenetAuthService, public translate: TranslateService) {

  }

  removeHost(): void {
    localStorage.removeItem('hostname');
  }

  changeLang() {
    this.translate.use(this.selectedLang);
  }

}
