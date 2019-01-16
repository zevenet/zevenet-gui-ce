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
  selector: 'zevenet-lslb-certificates',
  templateUrl: './certificates.component.html',
})
export class CertificatesComponent implements  OnInit {

  certificates: Array<any>;

  actionResp: any;

  columns: Array<any> = [
    {field: 'CN', header: 'Common Name', width: '20%'},
    {field: 'type', header: 'Type', width: '10%'},
    {field: 'file', header: 'File', width: '20%'},
    {field: 'issuer', header: 'Issuer', width: '15%'},
    {field: 'creation', header: 'Create on', width: '12%'},
    {field: 'expiration', header: 'Expire on', width: '13%'},
  ];

  actionsList: Array<any> = [
    {action: 'download', icon: 'fa-download'},
    {action: 'delete', icon: 'fa-trash'},
  ];

  constructor(private service: ZevenetService) { }

  ngOnInit() {
    this.getCertificates();
  }

  public getCertificates(): void {
    this.service.getList('certificates')
      .subscribe((data) => {
        this.certificates  =  data.params;
      });
  }

  onAction(event) {
    if (event.action === 'delete') {
      if (window.confirm('Are you sure you want to delete the certificate ' + event.data.file + '?')) {
        this.service.delete('certificates', event.data.file)
        .subscribe(
          (data) => { this.actionResp  =  data; },
          (error) => { },
          () => {
            this.certificates.splice(this.certificates.findIndex(i => i.file === event.data.file), 1);
            this.service.showToast(
							'success',
							 '',
							 'The certificate <strong>' + event.data.file + '</strong> has been deleted successfully.',
						);
          });
      }
    } else {
    this.service.download('certificates', event.data.file)
      .subscribe(
        (data) => { this.actionResp  =  data; },
        (error) => { },
        () => {
          this.service.downloadFile(this.actionResp, event.data.file, 'application/x-pem-file');
          this.service.showToast(
						'success',
						 '',
						 'The certificate <strong>' + event.data.file + '</strong> has been downloaded successfully.',
					);
        });
    }
  }

  downloadFile(data, nameFile): void {
    const blob = new Blob([data], {type: 'application/x-pem-file'});
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
