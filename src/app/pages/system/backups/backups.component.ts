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
  selector: 'zevenet-system-backups',
  templateUrl: './backups.component.html',
})
export class BackupsComponent implements  OnInit {

  backups: Array<any>;

  actionResp: any;

  columns: Array<any> = [
    {field: 'name', header: '', width: '50%'},
    {field: 'date', header: '', width: '40%'},
  ];

  actionsList: Array<any> = [
    {action: 'apply', icon: 'fa-check'},
    {action: 'download', icon: 'fa-download'},
    {action: 'delete', icon: 'fa-trash'},
  ];

  constructor(private service: ZevenetService) {
   }


  ngOnInit() {
    this.getBackups();
    this.getLangTranslated('TABLES', this.columns);
  }

  getLangTranslated(selectJson: string, columns: any): any {
    this.service.refreshLang(selectJson, columns)
      .subscribe((langTranslated) => this.columns = langTranslated);
  }

  showMessageTranslated(textlang: string, func: string, param?: any, param2?: any): any {
    return this.service.interpolateLang(textlang, { param: param.name, param2: param2 })
      .then(data => {
        if (func === 'toast') {
          this.service.showToast('success', '', data);
        } else if (func === 'window') {
          if (window.confirm(data))
            this.delete(param);
        }
      });
  }
  getBackups(): void {
    this.service.getList('system/backup')
      .subscribe((data) => {
        this.backups  =  data.params;
      });
  }

  delete(data) {
    this.service.delete('system/backup', data.name)
    .subscribe(
      (resp) => { this.actionResp  =  resp; },
      (error) => { },
      () => {
        this.backups.splice(this.backups.findIndex(i => i.name === data.name), 1);
        this.showMessageTranslated('SYSTEM_MESSAGES.system.backup_deleted', 'toast', data);
      });
  }

  onAction(event) {
    if (event.action === 'delete') {
      this.showMessageTranslated('SYSTEM_MESSAGES.system.backup_confirm_deleted', 'window', event.data);
    } else if (event.action === 'apply') {
      const param = {action: event.action};
      this.service.post('system/backup/' + event.data.name + '/actions', param)
        .subscribe(
          (data) => { this.actionResp  =  data; },
          (error) => { },
          () => {
            this.showMessageTranslated('SYSTEM_MESSAGES.system.backup_applied', 'toast', event.data);
          });
    } else {
      this.service.download('system/backup', event.data.name)
        .subscribe(
          (data) => { this.actionResp  =  data; },
          (error) => { },
          () => {
            this.service.downloadFile(this.actionResp, event.data.name, 'application/tar+gzip');
            this.showMessageTranslated('SYSTEM_MESSAGES.system.backup_downloaded', 'toast', event.data);
          });
    }
  }

  downloadFile(data, nameFile): void {
    const blob = new Blob([data], {type: 'application/tar+gzip'});
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
