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
  selector: 'zevenet-network-gateway',
  templateUrl: './gateway.component.html',
})
export class GatewayComponent implements OnInit {

  interfaces: Array<any>;

  actionResp: any;

  gateway: any = {ipv6: [], ipv4: []};

  columns: Array<any> = [
    {field: 'address', header: 'Address', width: '50%'},
    {field: 'interface', header: 'Interface', width: '40%'},
  ];

  actionsList: Array<any> = [
    {action: 'unset', icon: 'fa-eraser'},
  ];

  constructor(private service: ZevenetService) { }

  ngOnInit() {
    this.getInterfaces();
  }

  public getInterfaces(): void {
    this.service.getList('interfaces/gateway/ipv4')
      .subscribe((data) => {
        this.gateway.ipv4  =  data.params;
      });
    this.service.getList('interfaces/gateway/ipv6')
      .subscribe((data) => {
        this.gateway.ipv6  =  data.params;
      });
  }

  onAction(event) {
    if (event.action === 'unset' &&
      window.confirm('Are you sure you want to unset the ' + event.data.version + ' gateway?')) {
      this.service.delete('interfaces/gateway', event.data.version.toLowerCase())
        .subscribe(
          (data) => { this.actionResp  =  data; },
          (error) => {},
          () => {
            const object = event.data;
            object.address = null;
            object.interface = null;
            if (event.version === 'IPv4') {
              this.gateway.ipv4 = object;
            } else {
              this.gateway.ipv6 = object;
            }
            this.service.showToast(
							'success',
							 '',
							 'The <strong>' + event.version + '</strong> Gateway has been unconfigured successfully.',
						);
          });
    }
  }
}
