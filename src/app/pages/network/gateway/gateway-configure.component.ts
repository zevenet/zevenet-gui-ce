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
import { ZevenetService } from '../../../@core/zevenet/services/zevenet.service';
import isEqual from 'lodash/isEqual';

@Component({
  selector: 'zevenet-network-gateway-update',
  templateUrl: './gateway-configure.component.html',
})
export class GatewayConfigureComponent implements  OnInit {

  name: string;

  interface: any;

  form: FormGroup;

  resAction: any;

  resParams: any;

  actionResp: any;

  unsetting: boolean = false;

  interfaces: Array<any>;

  interfaceValues: any;

  denySubmit: boolean = true;

  constructor(private service: ZevenetService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.name = this.route.snapshot.paramMap.get('name');
    this.getInterface(this.name);
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
  }

  createForm() {
    this.form = new FormGroup(this.fb.group({
      address: [this.interface.address, Validators.required],
      interface: [this.interface.interface, Validators.required],
    }).controls, {updateOn: 'blur'});

    this.interfaceValues = this.form.value;
    this.form.valueChanges.subscribe((val) => {
      this.denySubmit = isEqual(val, this.interfaceValues);
    });
  }


  getInterface(name, refresh = false): void {
    this.service.getObject('interfaces/gateway', this.name)
      .subscribe(
        (data) => {
          this.interface  =  data.params;
        },
        (error) => {},
        () => {
          if ( !refresh ) {
            this.createForm();
            this.service.getList('interfaces')
              .subscribe((data) => { this.interfaces  =  data.interfaces; });
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
      this.service.update('interfaces/gateway', this.name, submit)
        .subscribe(
          (data) => {
            this.resParams = data.params;
            this.resAction = data;
          },
          (error) => { this.denySubmit = false; },
          () => {
            this.interfaceValues = this.form.value;
            this.interface.interface = this.interfaceValues.interface;
            this.interface.address = this.interfaceValues.address;
            this.showMessageTranslated('SYSTEM_MESSAGES.network.gateway_update', 'toast', this.name.toUpperCase());
            this.denySubmit = false;
          });
    }
  }

  unsetInterface(event): void {
    event.preventDefault();
    if (this.showMessageTranslated('SYSTEM_MESSAGES.network.gateway_confirm_unset', 'window')) {
      this.unsetting = true;
      this.service.delete('interfaces/gateway', this.name)
        .subscribe(
          (data) => { this.actionResp  =  data; },
          (error) => { this.unsetting = false; },
          () => {
            Object.keys(this.interfaceValues).forEach((param) => {
              this.f[param].setValue(null);
              this.interfaceValues[param] = null;
              this.interface[param] = null;
            }, this);
            this.unsetting = false;
            this.showMessageTranslated(
              'SYSTEM_MESSAGES.network.gateway_unconfigured',
              'toast',
              this.name.toUpperCase(),
            );
          });
    }
  }

  get f() {
    return this.form.controls;
  }
}
