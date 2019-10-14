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
  selector: 'zevenet-network-virtual',
  templateUrl: './virtual.component.html',
})
export class VirtualComponent implements OnInit {

  interfaces: Array<any>;

  actionResp: any;

  columns: Array<any> = [
    {field: 'name', header: '', width: '20%'},
    {field: 'ip', header: '', width: '15%'},
    {field: 'mac', header: '', width: '15%'},
    {field: 'netmask', header: '', width: '15%'},
    {field: 'gateway', header: '', width: '15%'},
    {field: 'status', header: '', width: '10%'},
  ];

  actionsList: Array<any> = [
    {action: 'down', icon: 'fa-stop'},
    {action: 'up', icon: 'fa-play'},
    {action: 'delete', icon: 'fa-trash'},
  ];

  constructor(private service: ZevenetService) { }

  ngOnInit() {
    this.getInterfaces();
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

  getInterfaces(): void {
    this.service.getList('interfaces/virtual')
      .subscribe((data) => {
        this.interfaces  =  data.interfaces;
      });
  }

  delete(data) {
    this.service.delete('interfaces/virtual', data.name)
      .subscribe(
        (resp) => { this.actionResp  =  resp; },
        (error) => { },
        () => {
          this.interfaces.splice(this.interfaces.findIndex(i => i.name === data.name), 1);
          this.showMessageTranslated('SYSTEM_MESSAGES.network.virtual_interface_deleted', 'toast', data);
        });
  }

  onAction(event) {
    if (event.action === 'delete') {
      this.showMessageTranslated(
        'SYSTEM_MESSAGES.network.virtual_interface_confirm_deleted',
        'window',
        event.data,
      );
    } else {
      const param = {action: event.action};
      this.service.actionNetwork(event.data.name, 'virtual', param)
        .subscribe(
          (data) => { this.actionResp  =  data; },
          (error) => {},
          () => {
            const object = event.data;
            object.status = this.actionResp.params.action;
            this.interfaces[this.interfaces.findIndex(i => i.name === event.data.name)] = object;
            let actionMsg = '';
            this.service.translateLang('STATUS.' + object.status, actionMsg)
              .subscribe((translated) => {
                actionMsg = translated;
                this.showMessageTranslated(
                  'SYSTEM_MESSAGES.network.virtual_interface_is',
                  'toast',
                  event.data,
                  actionMsg,
                );
              });
          });
    }
  }
}
