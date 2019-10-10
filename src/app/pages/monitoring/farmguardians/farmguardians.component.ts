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
  selector: 'zevenet-monitoring-farmguardians',
  templateUrl: './farmguardians.component.html',
})
export class FarmguardiansComponent implements OnInit {

  rules: Array<any>;

  actionResp: any;

  columns: Array<any> = [
    {field: 'name', header: '', width: '20%'},
    {field: 'description', header: '', width: '25%'},
    {field: 'command', header: '', width: '20%'},
    {field: 'farms', header: '', width: '25%'},
  ];

  actionsList: Array<any> = [
    {action: 'delete', icon: 'fa-trash'},
  ];

  constructor(private service: ZevenetService) { }

  ngOnInit() {
    this.getRules();
    this.getLangTranslated('TABLES', this.columns);
  }

  getLangTranslated(selectJson: string, columns: any): any {
    this.service.refreshLang(selectJson, columns)
      .subscribe((langTranslated) => this.columns = langTranslated);
  }

  showMessageTranslated(textlang: string, func: string, param?: any, param2?: any): any {
    return this.service.interpolateLang(textlang, {param: param, param2: param2})
    .then(data =>  {
      if (func === 'toast') {
        this.service.showToast('success', '', data);
      } else if (func === 'window') {
        return window.confirm(data);
      }
    });
  }

  getRules(): void {
    this.service.getList('monitoring/fg')
      .subscribe((data) => {
        this.rules  =  data.params;
      });
  }

  onAction(event) {
    if (event.action === 'delete') {
      if (this.showMessageTranslated('SYSTEM_MESSAGES.farm.farmguardian_confirm_delete', 'window', event.data.name)) {
        this.service.delete('monitoring/fg', event.data.name)
        .subscribe(
          (data) => { this.actionResp  =  data; },
          (error) => { event.confirm.reject(); },
          () => {
            this.rules.splice(this.rules.findIndex(i => i.name === event.data.name), 1);
            this.showMessageTranslated('SYSTEM_MESSAGES.farm.farmguardian_delete', 'toast', event.data.name);
          });
      }
    }
  }
}
