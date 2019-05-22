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
import { Toast, BodyOutputType } from 'angular2-toaster';
import { UpdateForceToastComponent } from '../../../@core/zevenet/components/toast/update-force-toast.component';
import { ZevenetService } from '../../../@core/zevenet/services/zevenet.service';
import isEqual from 'lodash/isEqual';

@Component({
  selector: 'zevenet-network-vlan-update',
  templateUrl: './vlan-update.component.html',
})
export class VlanUpdateComponent implements  OnInit {

  name: string;

  interface: any;

  form: FormGroup;

  resAction: any;

  resParams: any;

  actionResp: any;

  interfaceValues: any;

  denySubmit: boolean = true;

  toastForce: Toast = {
    type: 'warning',
    timeout: 0,
    bodyOutputType: BodyOutputType.Component,
    body: UpdateForceToastComponent,
    data: {
      url: 'interfaces/vlan',
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
        component.interfaceValues = component.form.value;
        component.denySubmit = true;
      }
    },
  };

  constructor(private service: ZevenetService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.name = this.route.snapshot.paramMap.get('name');
    this.getInterface(this.name);
    this.toastForce.data.name = this.name;
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
  }  isNecessaryForce(object) {
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
      ip: [this.interface.ip, Validators.required],
      netmask: [this.interface.netmask, Validators.required],
      gateway: [this.interface.gateway],
    }).controls, {updateOn: 'blur'});

    this.interfaceValues = this.form.value;
    this.form.valueChanges.subscribe((val) => {
      this.denySubmit = isEqual(val, this.interfaceValues);
    });
  }


  getInterface(name, refresh = false): void {
    this.service.getObject('interfaces/vlan', this.name)
      .subscribe(
        (data) => {
          this.interface  =  data.interface;
          this.interface.tag = data.interface.name.split('.')[1];
        },
        (error) => {},
        () => {
          if ( !refresh ) {
            this.createForm();
          }
        });
  }

  getDirtyValues(form, subobject?) {
    const dirtyValues = <any>{};

    Object.keys(form.controls).forEach((name) => {
      const currentControl = form.controls[name];

      if (currentControl.dirty) {
        if (currentControl.controls) {
          if (!isEqual(currentControl.value, this.interfaceValues[name])) {
            dirtyValues[name] = this.getDirtyValues(currentControl, name);
          }
        } else {
          if (subobject) {
            if (currentControl.value !== this.interfaceValues[subobject][name]) {
              dirtyValues[name] = currentControl.value;
            }
          } else {
            if (currentControl.value !== this.interfaceValues[name]) {
              dirtyValues[name] = currentControl.value;
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

      this.service.update('interfaces/vlan', this.name, submit)
        .subscribe(
          (data) => {
            this.resParams = data.params;
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
            this.interfaceValues = this.form.value;
            this.denySubmit = false;
            this.showMessageTranslated('SYSTEM_MESSAGES.network.vlan_update', 'toast', this.name);
          });
    }
  }

  get f() {
    return this.form.controls;
  }
}
