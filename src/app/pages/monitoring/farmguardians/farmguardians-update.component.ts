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
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToBooleanPipe } from '../../pipes/to-boolean.pipe';
import { Toast, BodyOutputType } from 'angular2-toaster';
import { UpdateForceToastComponent } from '../../../@core/zevenet/components/toast/update-force-toast.component';
import { ZevenetService } from '../../../@core/zevenet/services/zevenet.service';
import isEqual from 'lodash/isEqual';

@Component({
  selector: 'zevenet-monitoring-farmguardians-update',
  templateUrl: './farmguardians-update.component.html',
})
export class FarmguardiansUpdateComponent implements  OnInit {

  name: string;

  rule: any;

  form: FormGroup;

  resAction: any;

  resParams: any;

  actionResp: any;

  ruleValues: any;

  denySubmit: boolean = true;

  errorRule: boolean = false;

  farmList: Array<any>;

  columns: Array<any> = [
    {field: 'farm', header: 'Farm', width: '45%'},
    {field: 'service', header: 'Service', width: '45%'},
  ];

  actionsList: Array<any> = [
    {action: 'unset', icon: 'fa-eraser'},
  ];

  toastForce: Toast = {
    type: 'warning',
    timeout: 0,
    bodyOutputType: BodyOutputType.Component,
    body: UpdateForceToastComponent,
    data: {
      url: 'monitoring/fg',
      object: 'VLAN',
    },
    onHideCallback: (toast) => {
      if (toast.data.success) {
        const component = this;
        Object.keys(toast.data.params).forEach(function(param) {
          if (this.form.controls.hasOwnProperty(param)) {
           this.form.controls[param].setValue(toast.data.params[param], {emitEvent: false});
          }
        }, this);
        component.ruleValues = component.form.value;
        component.denySubmit = true;
      }
    },
  };

  constructor(private service: ZevenetService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private pipe: ToBooleanPipe,
  ) { }

  ngOnInit() {
    this.name = this.route.snapshot.paramMap.get('name');
    this.getRule(this.name);
    this.toastForce.data.name = this.name;
  }

  isNecessaryForce(object) {
    if (object.hasOwnProperty('force')) {
      if (object.force === 'true') {
        this.toastForce.data.message = object.message;
        this.toastForce.data.success = null;
        this.service.alertForce(this.toastForce);
      }
    }
  }

  createForm() {
    this.form = new FormGroup(this.fb.group({
      name: [{value: this.rule.name, disabled: true}, Validators.required],
      description: [{value: this.rule.description, disabled: this.rule.template}],
      command: [{value: this.rule.command, disabled: this.rule.template}, Validators.required],
      interval: [{value: this.rule.interval, disabled: this.rule.template}],
      cut_conns: [{value: this.rule.cut_conns, disabled: this.rule.template}],
      log: [{value: this.rule.log, disabled: this.rule.template}],
    }).controls, {updateOn: 'blur'});

    this.ruleValues = this.form.value;
    this.form.valueChanges.subscribe((val) => {
      this.denySubmit = isEqual(val, this.ruleValues);
    });
  }


  getRule(name, refresh = false): void {
    this.service.getObject('monitoring/fg', this.name)
      .subscribe(
        (data) => {
          this.rule  =  this.pipe.transform(data.params);
        },
        (error) => {},
        () => {
          if ( !refresh ) {
            this.createForm();
          }
        });
  }

  getDirtyValues(form, subobject?) {
    const dirtyValues = {};

    Object.keys(form.controls).forEach((name) => {
      const currentControl = form.controls[name];

      if (currentControl.dirty) {
        if (currentControl.controls) {
          if (!isEqual(currentControl.value, this.ruleValues[name])) {
            dirtyValues[name] = this.getDirtyValues(currentControl, name);
          }
        } else {
          if (subobject) {
            if (currentControl.value !== this.ruleValues[subobject][name]) {
              dirtyValues[name] = typeof currentControl.value !== 'boolean' ?
                currentControl.value : String(currentControl.value);
            }
          } else {
            if (currentControl.value !== this.ruleValues[name]) {
              dirtyValues[name] = typeof currentControl.value !== 'boolean' ?
                currentControl.value : String(currentControl.value);
            }
          }
        }
      }
    }, this);

    return dirtyValues;
  }

  onSubmit() {
    const submit = this.getDirtyValues(this.form);

    if (Object.keys(submit).length > 0) {
      this.denySubmit = true;
      this.service.update('monitoring/fg', this.name, submit)
        .subscribe(
          (data) => {
            this.resParams = this.pipe.transform(data.params);
            this.resAction = data;
          },
          (error) => {
            this.denySubmit = false;
            this.toastForce.data.params = submit;
            this.isNecessaryForce(error);
          },
          () => {
            Object.keys(this.resParams).forEach(function(param) {
              if (this.form.controls.hasOwnProperty(param)) {
               this.form.controls[param].setValue(this.resParams[param], {emitEvent: false});
              }
            }, this);
            this.ruleValues = this.form.value;

            this.service.showToast(
							'success',
							 '',
							 'The <strong>' + this.name + '</strong> farmguardian has been updated successfully.',
						);
          });
    }
  }

  get f() {
    return this.form.controls;
  }

  onAction(event): void {
    const data = event.data.split('_');
    const text = data[1] ? ' with service ' + data[1] : ' ';
    if (window.confirm('Are you sure you want to delete the farm ' + data[0] + text + ' of the farmguardian?')) {
      const url = data[1] ? 'farms/' + data[0] + '/services/' + data[1] + '/fg' : 'farms/' + data[0] + '/fg';
      this.service.delete(url, this.name)
      .subscribe(
        (resp) => { this.actionResp  =  resp; },
        (error) => { },
        () => {
          this.rule.farms.splice(this.rule.farms.findIndex(i => i === event.data));
          const message = data[1] ? 'with service ' + data[1] : '';
          this.service.showToast(
						'success',
						 '',
						 'The farm <strong>' + data[0] + '</strong> ' + message + ' has been deleted successfully.',
					);
        });
    }
  }
}
