/**
  * @license
  * Zevenet Software License
  * This file is part of the Zevenet Load Balancer software.
  *
  * Copyright (C) 2019-today ZEVENET SL, Sevilla (Spain)
  * Licensed under the terms of the GNU Affero General Public License.
  * See License.txt in the project root for license information.
**/

import { Injectable } from '@angular/core';
import 'rxjs';
import { NbAuthService } from '@nebular/auth';

@Injectable({
providedIn:  'root',
})

export class ZevenetAuthService {

  token: any;
  hostname: any;

  constructor(private authService: NbAuthService) {
  	this.setFooter();
  }

  setFooter(): void {
    this.hostname = localStorage.getItem('hostname');
    this.authService.getToken()
      .subscribe((token) => {
            this.token = token;
       });
  }
}
