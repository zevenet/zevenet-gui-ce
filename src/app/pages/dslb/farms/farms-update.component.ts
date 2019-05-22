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
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ZevenetService } from '../../../@core/zevenet/services/zevenet.service';
import isEqualWith from 'lodash/isEqualWith';

@Component({
  selector: 'zevenet-dslb-farms-update',
  templateUrl: './farms-update.component.html',
})
export class FarmsUpdateComponent implements  OnInit {

  name: string;

  farm: any;

  interfaces: Array<any>;

  readonly: boolean = false;

  globalForm: FormGroup;

  resAction: any;

  resParams: any;

  denySubmit: boolean = true;

  farmValues: any;

  algorithms: Array<any> = [
    {label: 'Weight: connection linear dispatching by weight', value: 'weight'},
    {label: 'Priority: connections always to the most prio available', value: 'prio'},
  ];

  backends: Array<any>;

  columns: Array<any> = [
    {field: 'id', header: '', width: '5%', editable: false},
    {field: 'ip', header: '', width: '20%', editable: true},
    {field: 'interface', header: '', width: '18%', editable: true},
    {field: 'priority', header: '', width: '10%', editable: true},
    {field: 'weight', header: '', width: '10%', editable: true},
  ];

  actionsList: Array<any> = [
    {action: 'delete', icon: 'fa-trash'},
  ];

  constructor(private service: ZevenetService, private route: ActivatedRoute,
    private fb: FormBuilder) {}

  ngOnInit() {
    this.name = this.route.snapshot.paramMap.get('name');
    this.getFarm(this.name);
    this.getLangTranslated('TABLES', this.columns);
  }

  getLangTranslated(selectJson: string, columns: any): any {
    this.service.refreshLang(selectJson, columns)
      .subscribe((langTranslated) => this.columns = langTranslated);
  }

  showMessageTranslated(textlang: string, func: string, param?: any, param2?: any): any {
    return this.service.interpolateLang(textlang, { param: param, param2: param2 })
      .then(data => {
        if (func === 'toast') {
          this.service.showToast('success', '', data);
        } else if (func === 'window') {
          return window.confirm(data);
        }
      });
  }  createForm() {
    this.globalForm = this.fb.group({
      newfarmname: [this.name, [Validators.required, Validators.pattern('^[A-Za-z0-9\\-]{1,256}$')]],
      vip: [this.farm.vip, [Validators.required]],
      algorithm: [this.farm.algorithm, [Validators.required]],
    }, {updateOn: 'submit'});
    this.farmValues = this.globalForm.value;
    this.globalForm.valueChanges.subscribe((val) => {
      this.denySubmit = isEqualWith(val, this.farmValues, this.compareCustom);
    });
  }

  compareCustom(objValue, othValue, index, object, other, stack): boolean {
    if (index === 'algorithm') {
      return true;
    }
  }

  getFarm(name, refresh = false): void {
    this.service.getFarm(name)
      .subscribe(
        (data) => {
          this.farm  =  data.params;
          this.backends = data.backends;
        },
        (error) => {},
        () => {
          if ( !refresh ) {
            if (this.farm.status !== 'down') {
              this.readonly = true;
            }
            this.createForm();
          }
        });
    this.service.getList('interfaces')
      .subscribe((data) => {
        this.interfaces  =  data.interfaces;
      });
  }

  getDirtyValues(form) {
    const dirtyValues = {};

    Object.keys(form.controls).forEach((name) => {
      const currentControl = form.controls[name];

      if (currentControl.dirty) {
        if (currentControl.controls) {
          dirtyValues[name] = this.getDirtyValues(currentControl);
        } else {
          dirtyValues[name] = currentControl.value;
        }
      }
    }, this);

    return dirtyValues;
  }

  onSubmit(form) {
    const submit = this.getDirtyValues(this[form]);

    if (Object.keys(submit).length > 0) {
      this.denySubmit = true;
      this.service.update('farms', this.name, submit)
        .subscribe(
          (data) => {
            this.resParams = data.params;
            this.resAction = data;
          },
          (error) => { this.denySubmit = false; },
          () => {
            Object.keys(this.resParams).forEach(function(param) {
              if (param === 'newfarmname') {
                this.name = this.resParams.newfarmname;
                window.history.pushState({}, '', `/pages/dslb/farms/edit/${this.name}`);
              }
              this.globalForm.controls[param].setValue(this.resParams[param], {emitEvent: false});
            }, this);

            this.farmValues = this.globalForm.value;

            this.service.showToast('success', '', 'The farm has been updated successfully.');
          });
    }
  }

  onAction(evenDel): void {
    if (window.confirm('Are you sure you want to delete the backend ' + evenDel.data.id + '?')) {
      this.service.deleteBackend(this.name, evenDel.data.id)
      .subscribe(
        (data) => { this.resAction  =  data; },
        (error) => { evenDel.confirm.reject(); },
        () => {
          this.service.showToast(
            'success',
            '',
            'The backend <strong>' + evenDel.data.id + '</strong> has been deleted successfully.',
          );
          this.getFarm(this.name, true);
        });
    }
  }

  createBackend(backend): void {
    this.service.post('/farms/' + this.name + '/backends', backend)
      .subscribe(
        (data) => { this.resAction  =  data; },
        (error) => {  },
        () => {
          const items = [...this.backends];
          backend.id = this.backends.length;
          backend.priority = backend.priority ? backend.priority : 1;
          backend.weight = backend.weight ? backend.weight : 1;
          items.push(backend);
          this.backends = items;
          this.showMessageTranslated('SYSTEM_MESSAGES.farm.backend_created', 'toast');
        });
  }

  editBackend(backend: any): void {
    this.service.update('/farms/' + this.name + '/backends', backend.id, backend.object)
      .subscribe(
        (data) => { this.resAction  =  data; },
        (error) => {  },
        () => {
          const items = [...this.backends];
          Object.keys(backend.object).forEach((key) => {
            items[backend.index][key] = backend.object[key];
          });
          this.backends = items;
          this.showMessageTranslated('SYSTEM_MESSAGES.farm.backend_created', 'toast');
        });
  }

  get gF() {
    return this.globalForm.controls;
  }
}
