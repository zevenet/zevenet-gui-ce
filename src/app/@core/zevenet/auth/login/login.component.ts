/**
  * @license
  * Zevenet Software License
  * This file is part of the Zevenet Load Balancer software.
  *
  * Copyright (C) 2019-today ZEVENET SL, Sevilla (Spain)
  * Licensed under the terms of the GNU Affero General Public License.
  * See License.txt in the project root for license information.
**/

import { Component, Inject } from '@angular/core';
import { NbLoginComponent, NbAuthResult } from '@nebular/auth';
import { TranslateService } from '@ngx-translate/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NbAuthService, NB_AUTH_OPTIONS } from '@nebular/auth';
import { ZevenetAuthService } from '../zevenet-auth.service';

@Component({
  selector: 'zevenet-login',
  styleUrls: ['login.component.scss'],
  templateUrl: './login.component.html',
})
export class ZevenetLoginComponent extends NbLoginComponent {

  login_texts: any;

  constructor(protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected router: Router,
    protected translate: TranslateService,
    protected zevenetAuthService: ZevenetAuthService) {
    super(service, options, cd, router);

    if (!this.translate.getDefaultLang()) {
      const lang = localStorage.getItem('lang')
      if (lang) {
        this.translate.setDefaultLang(lang);
      } else {
        this.translate.setDefaultLang('en');
      }
    }

    this.translate.get('AUTH.login')
      .subscribe((text) => this.login_texts = text);

    const params = {
      param: this.getConfigValue('forms.validation.password.minLength'),
      param2: this.getConfigValue('forms.validation.password.maxLength'),
    };
    this.translate.get('AUTH.login.password_contains', params)
      .subscribe((text) => this.login_texts.password_contains = text);

  }

  login(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    this.service.authenticate(this.strategy, this.user).subscribe((result: NbAuthResult) => {
      this.submitted = false;

      if (result.isSuccess()) {
        this.messages = result.getMessages();
        localStorage.setItem('hostname', result.getResponse().body.host);
        
        this.zevenetAuthService.getLanguage()
        .subscribe((data) => {
          const selectedLang = data.params.language || 'en';
          const current_lang = this.translate.getDefaultLang();
          if (current_lang !== selectedLang) {
            this.translate.setDefaultLang(selectedLang);
            localStorage.setItem('lang', selectedLang);
          }
        });
      } else {
        this.errors = result.getErrors();
      }

      const redirect = result.getRedirect();
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(redirect);
        }, this.redirectDelay);
      }
      this.cd.detectChanges();
    });
  }
}
