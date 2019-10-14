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
import isEqual from 'lodash/isEqual';

@Component({
  selector: 'zevenet-table-editable',
  templateUrl: './zevenet-table-editable.component.html',
})
export class ZevenetTableEditableComponent {

    @Input() object: string = '';
	@Input() set data(data: any) {
        this._data = data || [];
    }
	@Input() cols: any = [];
	@Input() actions: Array<any> = [];
    @Input() services: Array<any> = [];
    @Input() interfaces: Array<any> = [];
    @Input() titleCreate: string = 'Create';
    @Input() keySort: string = 'id';
	@Input() createButton: boolean = true;
	@Input() editButton: boolean = true;

	@Output() action: EventEmitter<any> = new EventEmitter();
    @Output() create: EventEmitter<any> = new EventEmitter();
    @Output() edit: EventEmitter<any> = new EventEmitter();

    typesResources: Array<any> = ['A', 'NS', 'AAAA', 'CNAME', 'DYNA', 'MX', 'SRV', 'TXT', 'PTR', 'NAPTR'];
    _data: any;
    displayDialog: boolean = false;
    new: boolean = false;
    newItem: any;
    oldIP: string;
    editing: any;
    changed: boolean = false;

    constructor() { }

    onAction(event, action, data): void {
    	event.preventDefault();
    	const obj = {action: action, data: data};
    	this.action.emit(obj);
    }

    showDialogToAdd() {
        this.new = true;
        this.newItem = {};
        this.displayDialog = true;
    }

    editRow(row) {
        this.new = false;
        this.editing = row;
        this.newItem =  Object.assign({}, row);
        this.oldIP = this.newItem.ip;
        this.displayDialog = true;
    }

    save() {
        delete this.newItem.status;
        if (this.new) {
            delete this.newItem.id;
            Object.keys(this.newItem).forEach(key => {
                if (!this.newItem[key])
                    delete this.newItem[key];
            });
            this.create.emit(this.newItem);
        } else {
            const id = this.newItem.id;
            delete this.newItem.id;
            const index = this._data.indexOf(this.editing);

            const object = {};
            Object.keys(this.newItem).forEach((key) => {
                if ((key === 'port' || this.newItem[key]) && this.newItem[key] !== this.editing[key])
                    object[key] = this.newItem[key];
            });
            this.edit.emit({object, id, index});
        }
        this.cancel();
    }

    cancel() {
        this.newItem = null;
        this.displayDialog = false;
        this.editing = null;
        this.changed = false;
    }

    onChange(event): void {
        if (this.new) {
            if (event.target && !event.target.value)
                delete this.newItem[event.target.id];
            if (Object.keys(this.newItem).length > 0) {
                this.changed = true;
            } else {
                this.changed = false;
            }
        } else {
            if (!isEqual(this.newItem, this.editing)) {
                this.changed = true;
            } else {
                this.changed = false;
            }
        }
    }

}
