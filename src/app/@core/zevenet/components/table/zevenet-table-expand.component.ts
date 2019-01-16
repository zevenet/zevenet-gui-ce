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
  selector: 'zevenet-table-expand',
  templateUrl: './zevenet-table-expand.component.html',
})
export class ZevenetTableExpandComponent {

	@Input() data: any;
	@Input() cols: any;
  @Input() keySort: string = 'name';
  @Input() expanded: Array<any> = [];
  @Input() subcolumns: any = [];

  @Output() toggleColumn: EventEmitter<any> = new EventEmitter();

  constructor() { }

  toggle(name): void {
      this.toggleColumn.emit(name);
  }
}
