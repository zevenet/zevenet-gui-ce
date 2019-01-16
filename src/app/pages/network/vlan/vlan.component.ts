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
  selector: 'zevenet-network-vlan',
  templateUrl: './vlan.component.html',
})
export class VlanComponent implements OnInit {

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
    {action: 'delete', icon: 'fa-trash'},
  ];

  constructor(private service: ZevenetService) { }

  ngOnInit() {
    this.getInterfaces();
  }

  getInterfaces(): void {
    this.service.getList('interfaces/vlan')
      .subscribe((data) => {
        this.interfaces  =  data.interfaces;
      });
  }

  onAction(event) {
    if (event.action === 'delete') {
      if (window.confirm('Are you sure you want to delete the ' + event.data.name + ' VLAN?')) {
        this.service.delete('interfaces/vlan', event.data.name)
        .subscribe(
          (data) => { this.actionResp  =  data; },
          (error) => { },
          () => {
            this.interfaces.splice(this.interfaces.findIndex(i => i.name === event.data.name), 1);
            this.service.showToast(
							'success',
							 '',
							 'The <strong>' + event.data.name + '</strong> VLAN has been deleted successfully.',
						);
          });
      }
    } else {
      const param = {action: event.action};
      this.service.actionNetwork(event.data.name, 'vlan', param)
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
							 'The <strong>' + event.data.name + '</strong> VLAN is ' + event.action,
						);
          });
    }
  }
}
