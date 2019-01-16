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
  selector: 'zevenet-network-nic',
  templateUrl: './nic.component.html',
})
export class NicComponent implements OnInit {

  interfaces: Array<any>;

  actionResp: any;

  columns: Array<any> = [
    {field: 'name', header: 'Name', width: '20%'},
    {field: 'ip', header: 'Address', width: '15%'},
    {field: 'mac', header: 'MAC', width: '15%'},
    {field: 'netmask', header: 'Netmask', width: '15%'},
    {field: 'gateway', header: 'Gateway', width: '15%'},
    {field: 'status', header: 'Status', width: '10%'},
  ];

  actionsList: Array<any> = [
    {action: 'down', icon: 'fa-stop'},
    {action: 'up', icon: 'fa-play'},
    {action: 'unset', icon: 'fa-eraser'},
  ];

  constructor(private service: ZevenetService) { }

  ngOnInit() {
    this.getInterfaces();
  }

  getInterfaces(): void {
    this.service.getList('interfaces/nic')
      .subscribe((data) => {
        this.interfaces  =  data.interfaces;
      });
  }

  onAction(event) {
    if (event.action === 'unset') {
      if (window.confirm('Are you sure you want to unset the ' + event.data.name + ' NIC?')) {
        this.service.delete('interfaces/nic', event.data.name)
          .subscribe(
            (data) => { this.actionResp  =  data; },
            (error) => {},
            () => {
              const object = event.data;
              Object.keys(object).forEach((key) => {
                if (key !== 'mac' && key !== 'status' && key !== 'name') {
                  object[key] = '';
                }
              });
              this.interfaces[this.interfaces.findIndex(i => i.name === event.data.name)] = object;
              this.service.showToast(
  							'success',
  							 '',
  							 'The <strong>' + event.data.name + '</strong> NIC has been unconfigured successfully.',
  						);
            });
      }
    } else {
      const param = {action: event.action};
      this.service.actionNetwork(event.data.name, 'nic', param)
        .subscribe(
          (data) => { this.actionResp  =  data; },
          (error) => {},
          () => {
            const object = event.data;
            object.status = this.actionResp.params.action;
            this.interfaces[this.interfaces.findIndex(i => i.name === event.data.name)] = object;
            this.service.showToast(
							'success',
							 '',
							 'The <strong>' + event.data.name + '</strong> NIC is ' + event.action,
						);
          });
    }
  }
}
