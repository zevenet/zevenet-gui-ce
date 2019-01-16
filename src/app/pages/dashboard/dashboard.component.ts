/**
  * @license
  * Zevenet Software License
  * This file is part of the Zevenet Load Balancer software.
  *
  * Copyright (C) 2019-today ZEVENET SL, Sevilla (Spain)
  * Licensed under the terms of the GNU Affero General Public License.
  * See License.txt in the project root for license information.
**/

import {Component, OnInit} from '@angular/core';
import { ZevenetService } from '../../@core/zevenet/services/zevenet.service';

@Component({
  selector: 'zevenet-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

  news: any;

  stats: any;

  info: any;

  network: any;

  interfaces: any = [];

  farms: any;

  columns: Array<any> = [
    {field: 'farmname', header: 'Name', width: '50%'},
    {field: 'profile', header: 'Profile', width: '30%'},
    {field: 'status', header: 'Status', width: '20%'},
  ];

  colorScheme = {
    domain: ['#21b573', '#999999'],
  };

  constructor(private service: ZevenetService) { }

  ngOnInit(): void {
    this.getStats();
    this.getInfo();
    this.getInterfaces();
    this.getFarms();
  }

  getNews(): void {
    this.service.getNews(this.info.hostname, this.info.zevenet_version)
      .subscribe(data => { this.news = data.results; });
  }

  getStats(): void {
    this.service.getStats()
      .subscribe(data => { this.stats = data.params; });
  }

  getInfo(): void {
    this.service.getInfo()
      .subscribe(
        data => { this.info = data.params; },
        error => { },
        () => {
          this.getNews();
        });
  }

  getInterfaces(): void {
    this.service.getStats('system/network')
      .subscribe(data => { this.network = data.params.interfaces; },
                 err => { },
                 () => {
                   this.network.forEach((interf) => {
                     if (!interf.interface.match(/[.\:]/)) {
                       this.interfaces.push(
                           {
                             name: interf.interface,
                             series: [
                              {
                                name: 'in',
                                value: interf.in,
                              },
                              {
                                name: 'out',
                                value: interf.out,
                              },
                             ],
                           },
                         );
                     }
                   });
                 },
        );
  }

  getFarms(): void {
    this.service.getFarms()
      .subscribe((data) => {
        this.farms  =  data.params;
      });
  }
}
