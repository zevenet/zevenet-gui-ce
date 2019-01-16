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
  selector: 'zevenet-monitoring-graphs',
  templateUrl: './graphs.component.html',
})
export class GraphsComponent implements  OnInit {

  systemValue: string;

  interfaceValue: string;

  farmValue: string;

  graphsSystem: Array<any>;

  graphsInterfaces: Array<any>;

  graphsFarms: Array<any>;

  systemList: Array<any>;

  interfaceList: Array<any>;

  farmList: Array<any>;

  loadingSystem: boolean = false;

  loadingInterfaces: boolean = false;

  loadingFarms: boolean = false;

  constructor(private service: ZevenetService, protected sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.getListSystem();
    this.getListInterfaces();
    this.getListFarms();
  }

  getListSystem(): void {
    this.service.getList('graphs/system')
      .subscribe(
        (data) => {
          this.systemList  =  [];
          data.system.forEach((item) => {
            if (item.disk) {
              item.disk.forEach((subitem) => {
                this.systemList.push('disk/' + subitem);
              });
            } else {
              this.systemList.push(item);
            }
          });
        });
  }

  getGraphSystem(): void {
    this.loadingSystem = true;
    if (this.systemValue)
      this.service.getList('graphs/system/' + this.systemValue)
        .subscribe(
          (data) => {
            this.graphsSystem  =  data.graphs;
            this.loadingSystem = false;
          });
  }

  getListInterfaces(): void {
    this.service.getList('interfaces')
      .subscribe(
        (data) => {
          this.interfaceList  =  data.interfaces;
        });
  }

  getGraphInterfaces(): void {
    this.loadingInterfaces = true;
    if (this.interfaceValue)
      this.service.getList('graphs/interfaces/' + this.interfaceValue)
        .subscribe((data) => {
          this.graphsInterfaces  =  data.graphs;
          this.loadingInterfaces = false;
        });
  }

  getListFarms(): void {
    this.service.getList('farms')
      .subscribe(
        (data) => {
          this.farmList  =  data.params;
        });
  }

  getGraphFarms(): void {
    this.loadingFarms = true;
    if (this.farmValue)
      this.service.getList('graphs/farms/' + this.farmValue)
        .subscribe((data) => {
          this.graphsFarms  =  data.graphs;
          this.loadingFarms = false;
        });
  }
}
