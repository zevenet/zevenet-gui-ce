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
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'zevenet-system-logs-view',
  templateUrl: './logs-view.component.html',
})
export class LogsViewComponent implements  OnInit {

  name: string;

  logs: Array<any>;

  logsList: Array<any>;

  actionResp: any;

  lines: any = 50;

  columns: Array<any> = [
    {field: 'id', header: '#', width: '10%'},
    {field: 'log', header: 'Log', width: '80%'},
  ];

  constructor(private service: ZevenetService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.name = this.route.snapshot.paramMap.get('name');
    this.getLog();
  }

  getLog(lines = false): void {
    if (lines)
      this.lines = lines;
    this.service.getList('system/logs/' + this.name + '/lines/' + this.lines)
      .subscribe((data) => {
        this.logsList  =  data.log;
        this.logs = this.logsList.map((log) => {
          return {log: log};
        });
      });
  }

}
