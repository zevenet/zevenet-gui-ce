/**
  * @license
  * Zevenet Software License
  * This file is part of the Zevenet Load Balancer software.
  *
  * Copyright (C) 2019-today ZEVENET SL, Sevilla (Spain)
  * Licensed under the terms of the GNU Affero General Public License.
  * See License.txt in the project root for license information.
**/

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ZevenetService } from '../../../@core/zevenet/services/zevenet.service';
import { DomSanitizer } from '@angular/platform-browser';
import { isArray } from 'util';
import { Chart } from 'chart.js';

@Component({
  selector: 'zevenet-monitoring-stats',
  styleUrls: ['./stats.component.scss'],
  templateUrl: './stats.component.html',
})
export class StatsComponent implements OnInit, OnDestroy {

  showCanvas = true;

  showExpanded: boolean;

  canvasCounter: number;

  charts: Array<Chart> = [];

  createdCharts = true;

  auxChartPoints: Array<any>;

  refreshTimer: number = 5;

  refreshDataInterval: any;

  selectedFarm: string = null;

  selectedFarmIndex: number = null;

  farms: any;

  subFarms: any;

  count: any = 0;

  modColumns: any;

  expandedFarms: Array<any> = [];

  expanded: Array<any> = [];

  titleCharts = [
    { field: 'established', header: '' },
    { field: 'pending', header: '' },
  ];

  columns = [
    { field: 'farmname', header: '', width: '20%' },
    { field: 'profile', header: '', width: '10%' },
    { field: 'vip', header: '', width: '20%' },
    { field: 'vport', header: '', width: '10%' },
    { field: 'established', header: '', width: '15%' },
    { field: 'pending', header: '', width: '15%' },
    { field: 'status', header: '', width: '10%' },
  ];

  subcolumns = {
    backend: {
      http: [
        { field: 'service', header: '', width: '20%', editable: false },
        { field: 'id', header: '', width: '5%', editable: false },
        { field: 'ip', header: '', width: '20%', editable: false },
        { field: 'port', header: '', width: '15%', editable: false },
        { field: 'status', header: '', width: '10%', editable: false },
        { field: 'established', header: '', width: '15%' },
        { field: 'pending', header: '', width: '15%' },
      ],
      l4xnat: [
        { field: 'id', header: '', width: '10%', editable: false },
        { field: 'ip', header: '', width: '25%', editable: false },
        { field: 'port', header: '', width: '20%', editable: false },
        { field: 'status', header: '', width: '10%', editable: false },
        { field: 'established', header: '', width: '18%' },
        { field: 'pending', header: '', width: '17%' },
      ],
    },
    session: {
      http: [
        { field: 'client', header: '', width: '25%', editable: false },
        { field: 'id', header: '', width: '25%', editable: false },
        { field: 'service', header: '', width: '25%', editable: false },
        { field: 'session', header: '', width: '25%', editable: false },
      ],
      l4xnat: [
        { field: 'id', header: '', width: '50%', editable: false },
        { field: 'session', header: '', width: '50%', editable: false },
      ],
    },
  };

  constructor(private service: ZevenetService, protected sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.getStats('farms', false, false);
    this.getLangTranslated('TABLES', this.columns);
    this.getLangTranslated('TABLES', this.subcolumns);
    this.getLangTranslatedchart('CHARTS', this.titleCharts);
  }

  ngOnDestroy() {
    clearInterval(this.refreshDataInterval);
    this.clearCharts();
  }

  tabChange(name: any) {
    if (name === 'Farms Stats') {
      this.showExpanded = true;
      this.clearCharts();
    } else {
      this.showExpanded = false;
      this.expandedFarms = [];
    }
  }

  getLangTranslatedchart(selectJson: string, columns: any): any {
    this.service.refreshLang(selectJson, columns)
      .subscribe((langTranslated) => {

        this.titleCharts = langTranslated;

      });
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

  getStats(type, load = true, subFarms = false): void {
    this.service.getStats(type)
      .subscribe((data) => {
        if (!load) {
          this.selectedFarm = data.farms[0].farmname;
        }
        if (subFarms) {
          this.canvasCounter = data.backends.length;
          this.subFarms = data;
        } else {
          this.farms = data;
        }
      }, (err) => { },
        () => {
          if (!this.createdCharts) {
            clearInterval(this.refreshDataInterval);
            this.createCharts();
            this.refreshData();
          }
          if (!this.refreshDataInterval) {
            this.refreshData();
          }
        });
  }

  addToggleColumn(name: any): void {
    let condition = true;
    let i = 0;
    while (condition && i < this.expandedFarms.length) {
      if (this.expandedFarms[i] === name) {
        condition = false;
      }
      i++;
    }
    if (!condition) {
      this.expandedFarms.splice((i - 1), 1);
    } else {
      this.toggleColumn(name);
      this.expandedFarms.push(name);
    }
  }

  toggleColumn(name, refresh = false): void {
    if (!this.expanded[name] || refresh) {
      this.service.getStats('farms/' + name)
        .subscribe(
          (data) => {
            this.expanded[name] = data;
          });
    }
  }

  createCharts() {
    this.clearCharts();
    this.showCanvas = true;
    let condition = true;
    let i = 0;
    while (condition) {
      if (this.farms.farms[i].farmname === this.selectedFarm) {
        condition = false;
        this.charts.push(this.createNewChart(this.selectedFarm));
        this.selectedFarmIndex = i;
      }
      i++;
    }
    setTimeout(() => {
      this.subFarms.backends.forEach(subCharts => {
        this.charts.push(this.createNewChart(this.selectedFarm + ' ' + subCharts.service + ' ' + subCharts.ip));
      });
      this.createdCharts = true;
    }, 1000);

  }

  createNewChart(chartName: any): Chart {
    const chart = new Chart('chart' + this.charts.length, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: this.titleCharts[0].header,
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(33, 181, 114, 0.58)',
            borderColor: 'rgba(33, 181, 114, 0.58)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(33, 181, 114, 0.58)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(33, 181, 114, 0.58)',
            pointHoverBorderColor: 'rgba(33, 181, 114, 0.58)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [],
          },
          {
            label: this.titleCharts[1].header,
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'red',
            borderColor: 'red',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'red',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'red',
            pointHoverBorderColor: 'red',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [],
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: chartName,
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
    return chart;
  }

  refreshData(): any {
    if (this.refreshDataInterval) {
      clearInterval(this.refreshDataInterval);
    }
    this.refreshDataInterval = setInterval(() => {
      this.refreshData();
      this.getStats('farms', true, false);
      if (this.charts.length > 0) {
        this.updateChartsStats(this.farms.farms[this.selectedFarmIndex], 0);

        if (this.canvasCounter > 0) {
          this.getStats('farms/' + this.selectedFarm, true, true);
          for (let i = 0; i < this.canvasCounter; i++) {
            this.updateChartsStats(this.subFarms.backends[i], i + 1);
          }
        }
      }
      if (this.expandedFarms.length > 0) {
        this.expandedFarms.forEach(expandedFarm => {
          this.toggleColumn(expandedFarm, true);
        });
      }
    }, this.refreshTimer * 1000);
  }


  updateChartDate(index: number): void {
    if (this.charts[index].data.labels.length > 9) {
      this.charts[index].data.labels.shift();
      this.charts[index].data.datasets[0].data.shift();
      this.charts[index].data.datasets[1].data.shift();
    }
    this.charts[index].data.labels.push(new Date().toLocaleString());
  }

  updateChartsStats(farm: any, index: any) {
    let chartDataAux;
    chartDataAux = this.charts[index].data.datasets[0].data;
    chartDataAux.push(farm.established);
    chartDataAux = this.charts[index].data.datasets[1].data;
    chartDataAux.push(farm.pending);
    this.updateChartDate(index);
    this.charts[index].update();
  }

  startCharts(): any {
    this.clearCharts();
    this.createdCharts = false;
    this.getStats('farms/' + this.selectedFarm, true, true);
  }

  clearCharts(): any {
    this.charts.forEach(element => {
      element.destroy();
    });
    this.charts = [];
  }
}
