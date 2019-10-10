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
  selector: 'zevenet-system-logs',
  templateUrl: './logs.component.html',
})
export class LogsComponent implements  OnInit {

  logs: Array<any>;

  actionResp: any;

  columns: Array<any> = [
    {field: 'file', header: '', width: '50%'},
    {field: 'date', header: '', width: '40%'},
  ];

  actionsList: Array<any> = [
    {action: 'download', icon: 'fa-download'},
  ];

  constructor(private service: ZevenetService) {
  }


  ngOnInit() {
    this.getLogs();
    this.getLangTranslated('TABLES', this.columns);
  }

  getLangTranslated(selectJson: string, columns: any): any {
    this.service.refreshLang(selectJson, columns)
      .subscribe((langTranslated) => this.columns = langTranslated);
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
  }

  getLogs(): void {
    this.service.getList('system/logs')
      .subscribe((data) => {
        this.logs  =  data.params;
      });
  }

  onAction(event) {
    this.service.download('system/logs', event.data.file)
      .subscribe(
        (data) => { this.actionResp  =  data; },
        (error) => { },
        () => {
          const type = event.data.file.includes('.gz') ? 'application/gzip' : 'text/plain';
          this.service.downloadFile(this.actionResp, event.data.file, type);
          this.showMessageTranslated('SYSTEM_MESSAGES.system.log_downloaded', 'toast', event.data.file);
        });
  }

  downloadFile(data, nameFile): void {
    const type = nameFile.includes('.gz') ? 'application/gzip' : 'text/plain';
    const blob = new Blob([data], {type: type});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('style', 'display: none');
    document.body.appendChild(a);
    a.href = url;
    a.download = nameFile;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}
