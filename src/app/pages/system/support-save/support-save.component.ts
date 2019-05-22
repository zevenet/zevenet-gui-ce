/**
  * @license
  * Zevenet Software License
  * This file is part of the Zevenet Load Balancer software.
  *
  * Copyright (C) 2019-today ZEVENET SL, Sevilla (Spain)
  * Licensed under the terms of the GNU Affero General Public License.
  * See License.txt in the project root for license information.
**/

import { Component, OnInit } from '@angular/core';
import { ZevenetService } from '../../../@core/zevenet/services/zevenet.service';

@Component({
  selector: 'zevenet-system-support-save',
  templateUrl: './support-save.component.html',
})
export class SupportSaveComponent implements  OnInit {

  supportSave: any;

  genereting: boolean = false;

  textButton: string = 'Generating...';

  constructor(private service: ZevenetService) { }

  ngOnInit() {
  }

  showMessageTranslated(textlang: string, func: string, param?: any, param2?: any): any {
    return this.service.interpolateLang(textlang, { param: param, param2: param2 })
      .then(data => {
        if (func === 'toast') {
          this.service.showToast('success', '', data);
        } else if (func === 'window') {
          return window.confirm(data);
        }
      });
  }  getSupportSave(): void {
    this.genereting = true;
    this.service.getObject('system', 'supportsave')
      .subscribe(
        (data) => {
          this.supportSave  =  data;
        },
        (error) => {
          this.genereting = false;
        },
        () => {
          this.textButton = 'Downloading...';
          this.downloadFile(this.supportSave);
          setTimeout(() => {
            this.genereting = false;
            this.textButton = 'Generating...';
            this.showMessageTranslated('SYSTEM_MESSAGES.system.support_save_downloaded', 'toast');
          }, 8000);
        });
  }

  downloadFile(data): void {
    const a = document.createElement('a');
    a.setAttribute('style', 'display: none');
    document.body.appendChild(a);
    const header = data.headers.get('Content-Disposition');
    const match = header.match(/filename=\"(.+)\"/);
    a.href = data.url;
    a.download = match[1];
    a.click();
    a.remove();
  }
}
