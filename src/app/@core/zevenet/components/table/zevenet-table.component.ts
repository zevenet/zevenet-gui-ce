/**
  * @license
  * Zevenet Software License
  * This file is part of the Zevenet Load Balancer software.
  *
  * Copyright (C) 2019-today ZEVENET SL, Sevilla (Spain)
  * Licensed under the terms of the GNU Affero General Public License.
  * See License.txt in the project root for license information.
**/

import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'zevenet-table',
  templateUrl: './zevenet-table.component.html',
})
export class ZevenetTableComponent {

  @Input() object: string = '';
	@Input() set data(data: any) {
    this._data = data;
    if (this.object === 'IPv4 gateway' || this.object === 'IPv6 gateway') {
        this._data[0].version = this.object.split(' ')[0].toLowerCase();
    }
  }
	@Input() cols: any;
	@Input() actions: Array<any> = [];
  @Input() titleCreate: string = 'Create';
  @Input() keySort: string = 'name';
  @Input() linesLog: number = 50;

	@Input() createButton: boolean = true;
	@Input() editButton: boolean = true;
  @Input() editConfig: any = {icon: 'fa-pen', title: 'Edit'};

	@Output() action: EventEmitter<any> = new EventEmitter();
  @Output() changeLines: EventEmitter<any> = new EventEmitter();

  charsFarms: number = 20;
  charsDescription: number = 20;
  charsCommand: number = 20;
  _data: any;

  constructor() { }

  onAction(event, action, data): void {
  	event.preventDefault();
  	const obj = {action: action, data: data};
      if (this.object === 'gateway') {
          const version = this.object.split(' ');
          obj['version'] = version[0];
          this.action.emit(obj);
      }
  	this.action.emit(obj);
  }

  getLog(): void {
      this.changeLines.emit(this.linesLog);
  }
}
