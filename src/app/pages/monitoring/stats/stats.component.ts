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
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'zevenet-monitoring-stats',
  styleUrls: ['./stats.component.scss'],
  templateUrl: './stats.component.html',
})
export class StatsComponent implements  OnInit {

  farms: any;

  expanded: Array<any> = [];

  columns = [
    {field: 'farmname', header: 'Name', width: '20%'},
    {field: 'profile', header: 'Profile', width: '10%'},
    {field: 'vip', header: 'Virtual IP', width: '20%'},
    {field: 'vport', header: 'Virtual Port', width: '10%'},
    {field: 'established', header: 'Established Conns', width: '15%'},
    {field: 'pending', header: 'Pending Conns', width: '15%'},
    {field: 'status', header: 'Status', width: '10%'},
  ];

  subcolumns = {
    backend: {
      http: [
        {field: 'service', header: 'Service', width: '20%', editable: false},
        {field: 'id', header: 'ID', width: '5%', editable: false},
        {field: 'ip', header: 'IP', width: '20%', editable: false},
        {field: 'port', header: 'Port', width: '15%', editable: false},
        {field: 'status', header: 'Status', width: '10%', editable: false},
        {field: 'established', header: 'Established Conns', width: '15%'},
        {field: 'pending', header: 'Pending Conns', width: '15%'},
      ],
      l4xnat: [
        {field: 'id', header: 'ID', width: '10%', editable: false},
        {field: 'ip', header: 'IP', width: '25%', editable: false},
        {field: 'port', header: 'Port', width: '20%', editable: false},
        {field: 'status', header: 'Status', width: '10%', editable: false},
        {field: 'established', header: 'Established Conns', width: '18%'},
        {field: 'pending', header: 'Pending Conns', width: '17%'},
      ],
    },
    session: {
      http: [
        {field: 'client', header: 'Client', width: '25%', editable: false},
        {field: 'id', header: 'Backend ID', width: '25%', editable: false},
        {field: 'service', header: 'Service', width: '25%', editable: false},
        {field: 'session', header: 'Session ID', width: '25%', editable: false},
      ],
      l4xnat: [
        {field: 'id', header: 'Backend ID', width: '50%', editable: false},
        {field: 'session', header: 'Session ID', width: '50%', editable: false},
      ],
    },
  };

  constructor(private service: ZevenetService, protected sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.getStats('farms');
  }

  getStats(type, load = true): void {
    this.service.getStats(type)
      .subscribe((data) => {
          this.farms = data;
      });
  }
  toggleColumn(name, refresh = false): void {
    if (!this.expanded[name] || refresh) {
      this.service.getStats('farms/' + name)
        .subscribe(
          (data) => {
            this.expanded[name]  =  data;
          });
    }
  }
}
