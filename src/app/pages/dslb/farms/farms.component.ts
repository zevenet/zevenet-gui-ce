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
  selector: 'zevenet-dslb-farms',
  templateUrl: './farms.component.html',
})
export class FarmsComponent implements  OnInit {

  farms: Array<any>;

  actionResp: any;

  columns: Array<any> = [
    {field: 'farmname', header: '', width: '25%'},
    {field: 'vip', header: '', width: '25%'},
    {field: 'interface', header: '', width: '20%'},
    {field: 'status', header: '', width: '10%'},
  ];

  actionsList: Array<any> = [
    {action: 'restart', icon: 'fa-sync-alt'},
    {action: 'stop', icon: 'fa-stop'},
    {action: 'start', icon: 'fa-play'},
    {action: 'delete', icon: 'fa-trash'},
  ];

  constructor(private service: ZevenetService) { }

  ngOnInit() {
    this.getFarms();
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

  getFarms(): void {
    this.service.getFarmsModule('dslb')
      .subscribe((data) => {
        this.farms  =  data.params;
      });
  }

  onAction(event) {
    if (event.action === 'delete') {
      if (this.showMessageTranslated('SYSTEM_MESSAGES.farm.confirm_delete', 'window', event.data.farmname)) {
        this.service.delete('farms', event.data.farmname)
        .subscribe(
          (data) => { this.actionResp  =  data; },
          (error) => { event.confirm.reject(); },
          () => {
            this.farms.splice(this.farms.findIndex(i => i.farmname === event.data.farmname), 1);
            this.showMessageTranslated('SYSTEM_MESSAGES.farm.delete', 'toast', event.data.farmname);
          });
      }
    } else {
      this.service.actionFarm(event.data.farmname, event.action)
        .subscribe(
          (data) => { this.actionResp  =  data; },
          (error) => {},
          () => {
            const object = event.data;
            object.status = this.actionResp.params.status;
            this.farms[this.farms.findIndex(i => i.farmname === event.data.farmname)] = object;
            const actionMsg = event.action === 'stop' ? 'stopp' : event.action;
            this.showMessageTranslated('SYSTEM_MESSAGES.farm.stop', 'toast', event.data.farmname, actionMsg);
          });
    }
  }
}
