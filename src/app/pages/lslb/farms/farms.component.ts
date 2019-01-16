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
    {field: 'farmname', header: 'Name', width: '20%'},
    {field: 'profile', header: 'Profile', width: '12%'},
    {field: 'vip', header: 'Virtual IP', width: '25%'},
    {field: 'vport', header: 'Virtual Port', width: '14%'},
    {field: 'status', header: 'Status', width: '10%'},
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
  }

  getFarms(): void {
    this.service.getFarmsModule('lslb')
      .subscribe((data) => {
        this.farms  =  data.params;
      });
  }

  onAction(event) {
    if (event.action === 'delete') {
      if (window.confirm('Are you sure you want to delete the farm ' + event.data.farmname + '?')) {
        this.service.delete('farms', event.data.farmname)
        .subscribe(
          (data) => { this.actionResp  =  data; },
          (error) => { },
          () => {
            this.farms.splice(this.farms.findIndex(i => i.farmname === event.data.farmname), 1);
            this.service.showToast(
								'success',
								 '',
								 'The farm <strong>' + event.data.farmname + '</strong> has been deleted successfully.',
							);
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
            this.service.showToast(
							'success',
							 '',
							 'The farm <strong>' + event.data.farmname + '</strong> has been ' + actionMsg + 'ed successfully.',
						);
          });
    }
  }
}
