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

  getSupportSave(): void {
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
            this.service.showToast(
              'success',
               '',
               'The <strong> Support Save </strong> has been downloaded successfully.',
            );
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
