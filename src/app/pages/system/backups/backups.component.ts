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
    {field: 'name', header: 'Name', width: '50%'},
    {field: 'date', header: 'Date', width: '40%'},
  ];

  actionsList: Array<any> = [
    {action: 'apply', icon: 'fa-check'},
    {action: 'download', icon: 'fa-download'},
    {action: 'delete', icon: 'fa-trash'},
  ];

  constructor(private service: ZevenetService) { }

  ngOnInit() {
    this.getBackups();
  }

  getBackups(): void {
    this.service.getList('system/backup')
      .subscribe((data) => {
        this.backups  =  data.params;
      });
  }

  onAction(event) {
    if (event.action === 'delete') {
      if (window.confirm('Are you sure you want to delete the backup ' + event.data.name + '?')) {
        this.service.delete('system/backup', event.data.name)
        .subscribe(
          (data) => { this.actionResp  =  data; },
          (error) => { },
          () => {
            this.backups.splice(this.backups.findIndex(i => i.name === event.data.name), 1);
            this.service.showToast(
							'success',
							 '',
							 'The backup <strong>' + event.data.name + '</strong> has been deleted successfully.',
						);
          });
      }
    } else if (event.action === 'apply') {
      const param = {action: event.action};
      this.service.post('system/backup/' + event.data.name + '/actions', param)
        .subscribe(
          (data) => { this.actionResp  =  data; },
          (error) => { },
          () => {
            this.service.showToast(
							'success',
							 '',
							 'The backup <strong>' + event.data.name + '</strong> has been applied successfully.',
						);
          });
    } else {
      this.service.download('system/backup', event.data.name)
        .subscribe(
          (data) => { this.actionResp  =  data; },
          (error) => { },
          () => {
            this.service.downloadFile(this.actionResp, event.data.name, 'application/tar+gzip');
            this.service.showToast(
							'success',
							 '',
							 'The backup <strong>' + event.data.name + '</strong> has been downloaded successfully.',
						);
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
