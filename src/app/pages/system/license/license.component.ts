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
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'zevenet-system-license',
  templateUrl: './license.component.html',
})
export class LicenseComponent implements OnInit {

  license: any;

  constructor(private service: ZevenetService, private sanitized: DomSanitizer) { }

  ngOnInit() {
    this.getLicense();
  }

  getLicense(): void {
    this.service.getObject('system/license', 'html')
      .subscribe((data) => {
        this.license  =  this.sanitized.bypassSecurityTrustHtml(data);
      });
  }
}
