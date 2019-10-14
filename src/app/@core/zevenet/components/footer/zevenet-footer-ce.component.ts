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
import { LANGS } from '../../../../../assets/i18n/langs/langs_en';

@Component({
  selector: 'zevenet-footer-ce',
  template: `
    <hr/>
    <nb-select *ngIf="LANGS" class="selectedlang" [(ngModel)]="selectedLang" (selectedChange)="changeLang()" status="warning">
      <nb-option *ngFor="let lang of LANGS" [value]="lang.code">{{lang.lang}}</nb-option>
    </nb-select>
    <div class="footer pt-3">
      <span *ngIf="zevenetAuthService?.hostname" class="pl-3"><i class="fa fa-desktop footer">
        </i> {{zevenetAuthService.hostname}}
      </span>
      <a *ngIf="zevenetAuthService?.token" class="nav-link" href="#" id="logout"
      [routerLink]="['/auth/logout']" (click)="removeHost()">
        <i class="fa fa-sign-out-alt footer"></i> {{logout}} ({{zevenetAuthService.token}})
      </a>
    </div>
  `,
  styles: [`
    /deep/ button {
      outline: none !important;
    }
  `],
})
export class ZevenetFooterCeComponent {

  LANGS = LANGS;
  selectedLang: string;
  logout: string;


  constructor(public zevenetAuthService: ZevenetAuthService, public translate: TranslateService) {
    this.selectedLang = this.translate.getDefaultLang() || 'en';
    this.getLogoutText();
    this.translate.onLangChange.subscribe((event: any) => {
      this.getLogoutText();
      this.selectedLang = event.lang;
    });
    translate.onDefaultLangChange.subscribe((event: any) => {
      this.selectedLang = event.lang;
      this.getLogoutText();
    });
  }

  getLogoutText() {
    this.translate.get('AUTH.logout')
      .subscribe((text) => this.logout = text);
  }

  removeHost(): void {
    localStorage.removeItem('hostname');
  }

  changeLang() {
    this.translate.use(this.selectedLang);

    this.zevenetAuthService.setLanguage(this.selectedLang)
      .subscribe((data) => {
        const lang = localStorage.getItem('lang');
        if (lang !== this.selectedLang)
          localStorage.setItem('lang', this.selectedLang);
      });
  }
}
