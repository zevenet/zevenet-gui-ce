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
import { isArray } from 'util';


@Component({
  selector: 'zevenet-monitoring-stats',
  styleUrls: ['./stats.component.scss'],
  templateUrl: './stats.component.html',
})
export class StatsComponent implements  OnInit {

  farms: any;

  modColumns: any;

  expanded: Array<any> = [];

  columns = [
    {field: 'farmname', header: '', width: '20%'},
    {field: 'profile', header: '', width: '10%'},
    {field: 'vip', header: '', width: '20%'},
    {field: 'vport', header: '', width: '10%'},
    {field: 'established', header: '', width: '15%'},
    {field: 'pending', header: '', width: '15%'},
    {field: 'status', header: '', width: '10%'},
  ];

  subcolumns = {
    backend: {
      http: [
        {field: 'service', header: '', width: '20%', editable: false},
        {field: 'id', header: '', width: '5%', editable: false},
        {field: 'ip', header: '', width: '20%', editable: false},
        {field: 'port', header: '', width: '15%', editable: false},
        {field: 'status', header: '', width: '10%', editable: false},
        {field: 'established', header: '', width: '15%'},
        {field: 'pending', header: '', width: '15%'},
      ],
      l4xnat: [
        {field: 'id', header: '', width: '10%', editable: false},
        {field: 'ip', header: '', width: '25%', editable: false},
        {field: 'port', header: '', width: '20%', editable: false},
        {field: 'status', header: '', width: '10%', editable: false},
        {field: 'established', header: '', width: '18%'},
        {field: 'pending', header: '', width: '17%'},
      ],
    },
    session: {
      http: [
        {field: 'client', header: '', width: '25%', editable: false},
        {field: 'id', header: '', width: '25%', editable: false},
        {field: 'service', header: '', width: '25%', editable: false},
        {field: 'session', header: '', width: '25%', editable: false},
      ],
      l4xnat: [
        {field: 'id', header: '', width: '50%', editable: false},
        {field: 'session', header: '', width: '50%', editable: false},
      ],
    },
  };

  constructor(private service: ZevenetService, protected sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.getStats('farms');
    this.getLangTranslated('TABLES', this.columns);
    this.getLangTranslated('TABLES', this.subcolumns);
  }

  getLangTranslated(selectJson: string, columns: any): any {
    this.service.refreshLang(selectJson, columns)
      .subscribe((langTranslated) => {
        if (isArray(langTranslated)) {
          this.columns = langTranslated;
        } else {
          this.subcolumns = langTranslated;
        }
      });
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
