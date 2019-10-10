/**
  * @license
  * Zevenet Software License
  * This file is part of the Zevenet Load Balancer software.
  *
  * Copyright (C) 2019-today ZEVENET SL, Sevilla (Spain)
  * Licensed under the terms of the GNU Affero General Public License.
  * See License.txt in the project root for license information.
**/

import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import 'rxjs';
import { NbAuthService } from '@nebular/auth';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn:  'root',
})

export class ZevenetAuthService {

  token: any;
  hostname: any;
  API_URL = '/zapi/v4.0/zapi.cgi';  

  constructor(private authService: NbAuthService, private httpClient: HttpClient) {
  	this.setFooter();
  }

  setFooter(): void {
    this.hostname = localStorage.getItem('hostname');
    this.authService.getToken()
      .subscribe((token) => {
            this.token = token;
       });
  }

  getLanguage(): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/system/info`);
  }

  setLanguage(lang): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/system/language`, {language: lang});
  }
}
