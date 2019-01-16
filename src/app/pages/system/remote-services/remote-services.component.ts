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
import { ZevenetService } from '../../../@core/zevenet/services/zevenet.service';
import isEqual from 'lodash/isEqual';

@Component({
  selector: 'zevenet-system-remote-services',
  templateUrl: './remote-services.component.html',
})
export class RemoteServicesComponent implements  OnInit {

  formDns: FormGroup;

  formNtp: FormGroup;

  formSnmp: FormGroup;

  resAction: any;

  resParams: any;

  actionResp: any;

  services: any = [];

  dnsValues: any;

  ntpValues: any;

  snmpValues: any;

  interfaces: any;

  dnsDenySubmit: boolean = true;

  snmpDenySubmit: boolean = true;

  ntpDenySubmit: boolean = true;

  constructor(private service: ZevenetService, private fb: FormBuilder) { }

  ngOnInit() {
    this.getService('dns');
    this.getService('ntp');
    this.getInterfaces();
    this.getService('snmp');
  }

  getInterfaces(): void {
    this.service.getList('interfaces')
      .subscribe(
        (data) => {
          this.interfaces  =  data.interfaces;
        },
        (err) => { },
        () => {
          this.interfaces.unshift({
            name: 'All interfaces',
            ip: '*',
          });
        });
  }

  getService(service): void {
    this.service.getObject('system', service)
    .subscribe(
      (data) => {
        this.services[service]  =  data.params;
      },
      (error) => {},
      () => {
        if (service === 'snmp')
          this.services[service].status = JSON.parse(this.services[service].status);
        this.createForm(service);
      });
  }

  createForm(type) {
    if (type === 'dns') {
      this.formDns = new FormGroup(this.fb.group({
        primary: [this.services.dns.primary, Validators.required],
        secondary: [this.services.dns.secondary],
      }).controls, {updateOn: 'blur'});

      this.dnsValues = this.formDns.value;
      this.formDns.valueChanges.subscribe((val) => {
        this.dnsDenySubmit = isEqual(val, this.dnsValues);
      });

    } else if (type === 'ntp') {
      this.formNtp = new FormGroup(this.fb.group({
        server: [this.services.ntp.server, Validators.required],
      }).controls, {updateOn: 'blur'});

      this.ntpValues = this.formNtp.value;
      this.formNtp.valueChanges.subscribe((val) => {
        this.ntpDenySubmit = isEqual(val, this.ntpValues);
      });

    } else if (type === 'snmp') {
      this.formSnmp = new FormGroup(this.fb.group({
        ip: [this.services.snmp.ip, Validators.required],
        port: [this.services.snmp.port, Validators.required],
        scope: [this.services.snmp.scope, Validators.required],
        community: [this.services.snmp.community, Validators.required],
        status: [this.services.snmp.status, Validators.required],
      }).controls, {updateOn: 'blur'});

      this.snmpValues = this.formSnmp.value;
      this.formSnmp.valueChanges.subscribe((val) => {
        this.snmpDenySubmit = isEqual(val, this.snmpValues);
      });
    }
  }

  getDirtyValues(form, type) {
    const dirtyValues = {};

    Object.keys(form.controls).forEach((name) => {
      const currentControl = form.controls[name];

      if (currentControl.dirty) {
        if (currentControl.controls) {
          dirtyValues[name] = this.getDirtyValues(currentControl, type);
        } else {
          const compForm = type + 'Values';
          if (currentControl.value !== this[compForm][name]) {
            dirtyValues[name] = typeof currentControl.value !== 'boolean' ?
              currentControl.value : String(currentControl.value);
          }
        }
      }
    }, this);

    return dirtyValues;
  }

  onSubmit(form, type) {
    const submit = this.getDirtyValues(this[form], type);

    if (Object.keys(submit).length > 0) {
      this[type + 'DenySubmit'] = true;
      this.service.post('system/' + type, submit)
        .subscribe(
          (data) => {
            this.resParams = data.params;
            this.resAction = data;
          },
          (error) => { this[type + 'DenySubmit'] = false; },
          () => {
            this[type + 'Values'] = this[form].value;
            this.service.showToast(
							'success',
							 '',
							 'The <strong>' + type.toUpperCase() + '</strong> service has been updated successfully.',
						);
          });
    }
  }

  get fDns() {
    return this.formDns.controls;
  }

  get fNtp() {
    return this.formNtp.controls;
  }

  get fSnmp() {
    return this.formSnmp.controls;
  }
}
