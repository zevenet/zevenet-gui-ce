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
    {field: 'name', header: 'Name', width: '20%'},
    {field: 'description', header: 'Description', width: '25%'},
    {field: 'command', header: 'Command', width: '20%'},
    {field: 'farms', header: 'Farms', width: '25%'},
  ];

  actionsList: Array<any> = [
    {action: 'delete', icon: 'fa-trash'},
  ];

  constructor(private service: ZevenetService) { }

  ngOnInit() {
    this.getRules();
  }

  getRules(): void {
    this.service.getList('monitoring/fg')
      .subscribe((data) => {
        this.rules  =  data.params;
      });
  }

  onAction(event) {
    if (event.action === 'delete') {
      if (window.confirm('Are you sure you want to delete the ' + event.data.name + ' farmguardian?')) {
        this.service.delete('monitoring/fg', event.data.name)
        .subscribe(
          (data) => { this.actionResp  =  data; },
          (error) => { event.confirm.reject(); },
          () => {
            this.rules.splice(this.rules.findIndex(i => i.name === event.data.name), 1);
            this.service.showToast(
							'success',
							 '',
							 'The <strong>' + event.data.name + '</strong> farmguardian has been deleted successfully.',
						);
          });
      }
    }
  }
}
