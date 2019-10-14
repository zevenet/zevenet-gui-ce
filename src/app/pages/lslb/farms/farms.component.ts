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
  selector: 'zevenet-lslb-farms',
  templateUrl: './farms.component.html',
})
export class FarmsComponent implements  OnInit {

  farms: Array<any>;

  actionResp: any;

  columns: Array<any> = [
    {field: 'farmname', header: '', width: '20%'},
    {field: 'profile', header: '', width: '12%'},
    {field: 'vip', header: '', width: '25%'},
    {field: 'vport', header: '', width: '14%'},
    {field: 'status', header: '', width: '10%'},
  ];

  actionsList: Array<any> = [
    {action: 'restart', icon: 'fa-sync-alt'},
    {action: 'stop', icon: 'fa-stop'},
    {action: 'start', icon: 'fa-play'},
    {action: 'delete', icon: 'fa-trash'},
  ];

  constructor(private service: ZevenetService) {}

  ngOnInit() {
    this.getFarms();
    this.getLangTranslated('TABLES', this.columns);
  }

  getLangTranslated(selectJson: string, columns: any): any {
    this.service.refreshLang(selectJson, columns)
      .subscribe((langTranslated) => columns = langTranslated);
  }

  showMessageTranslated(textlang: string, func: string, param: any, param2?: any): any {
    return this.service.interpolateLang(textlang, {param: param.farmname, param2: param2})
    .then(data =>  {
      if (func === 'toast') {
        this.service.showToast('success', '', data);
      } else if (func === 'window') {
        if (window.confirm(data))
          this.delete(param);
      }
    });
  }

  getFarms(): void {
    this.service.getFarmsModule('lslb')
      .subscribe((data) => {
        this.farms  =  data.params;
      });
  }

  delete(data) {
    this.service.delete('farms', data.farmname)
    .subscribe(
      (resp) => { this.actionResp  =  resp; },
      (error) => { },
      () => {
        this.farms.splice(this.farms.findIndex(i => i.farmname === data.farmname), 1);
        this.showMessageTranslated('SYSTEM_MESSAGES.farm.delete', 'toast', data);
      });
  }

  onAction(event) {
    if (event.action === 'delete') {
      this.showMessageTranslated('SYSTEM_MESSAGES.farm.confirm_delete', 'window', event.data);
    } else {
      this.service.actionFarm(event.data.farmname, event.action)
        .subscribe(
          (data) => { this.actionResp  =  data; },
          (error) => {},
          () => {
            const object = event.data;
            object.status = this.actionResp.params.status;

            this.farms[this.farms.findIndex(i => i.farmname === event.data.farmname)] = object;
            let actionMsg = event.action === 'stop' ? 'stopped' : event.action + 'ed';
            this.service.translateLang('STATUS.' + actionMsg, actionMsg)
              .subscribe((translated) => {
                actionMsg = translated;
                this.showMessageTranslated('SYSTEM_MESSAGES.farm.stop', 'toast', event.data, actionMsg);
              });
          });
    }
  }
}
