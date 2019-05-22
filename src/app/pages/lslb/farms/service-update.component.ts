/**
  * @license
  * Zevenet Software License
  * This file is part of the Zevenet Load Balancer software.
  *
  * Copyright (C) 2019-today ZEVENET SL, Sevilla (Spain)
  * Licensed under the terms of the GNU Affero General Public License.
  * See License.txt in the project root for license information.
**/

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToBooleanPipe } from '../../pipes/to-boolean.pipe';
import { ZevenetService } from '../../../@core/zevenet/services/zevenet.service';
import isEqual from 'lodash/isEqual';

@Component({
  selector: 'zevenet-lslb-farms-service',
  templateUrl: './service-update.component.html',
})
export class ServiceUpdateComponent implements OnInit {

  @Input() nameFarm: string;

  @Input() nameService: string;

  @Input() profile: string;

  @Input() farmguardians: Array<any>;

  @Output() restart: EventEmitter<any> = new EventEmitter();

  serviceParams: any;

  serviceForm: FormGroup;

  resAction: any;

  resParams: any;

  redirect_check: boolean = false;

  redirectTypes: Array<any> = [{ label: 'Default', value: 'default' }, { label: 'Append', value: 'append' }];

  farmguardian: any;

  persistenceTypes: Array<any> = [
    { label: '', value: '' },
    { label: '', value: 'IP' },
    { label: '', value: 'BASIC' },
    { label: '', value: 'URL' },
    { label: '', value: 'PARM' },
    { label: '', value: 'COOKIE' },
    { label: '', value: 'HEADER' },
  ];

  serviceValues: any;

  denySubmit: boolean = true;

  columns: Array<any> = [
    { field: 'id', header: '', width: '5%', editable: false },
    { field: 'ip', header: '', width: '20%', editable: true },
    { field: 'port', header: '', width: '18%', editable: true },
    { field: 'timeout', header: '', width: '10%', editable: true },
    { field: 'weight', header: '', width: '10%', editable: true },
  ];

  actionsList: Array<any> = [
    { action: 'maintenance', icon: 'fa-stop' },
    { action: 'up', icon: 'fa-play' },
    { action: 'delete', icon: 'fa-trash' },
  ];

  constructor(private service: ZevenetService, private fb: FormBuilder, private pipe: ToBooleanPipe) { }

  ngOnInit() {
    this.getService(this.nameService);
    this.getLangTranslated('TABLES', this.columns);
    this.getLangTranslated('LSLB.farms.http.service_settings.persistence', this.persistenceTypes);
  }

  getLangTranslated(selectJson: string, columns: any): any {
    this.service.refreshLang(selectJson, columns)
      .subscribe((langTranslated) => {
        columns = langTranslated;
      });
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
    this.serviceForm = new FormGroup(this.fb.group({
      httpsb: [this.serviceParams.httpsb],
      leastresp: [this.serviceParams.leastresp],
      persistence: [this.serviceParams.persistence],
      urlp: [this.serviceParams.urlp],
      vhost: [this.serviceParams.vhost],
      redirect: [this.serviceParams.redirect],
      redirecttype: [this.serviceParams.redirecttype],
    }).controls, { updateOn: 'blur' });
    this.farmguardian = this.serviceParams.farmguardian;

    this.serviceValues = this.serviceForm.value;
    this.serviceForm.valueChanges.subscribe((val) => {
      this.denySubmit = isEqual(val, this.serviceValues);
    });
  }

  getService(nameService, refresh = false): void {
    this.service.getService(this.nameFarm, this.nameService)
      .subscribe(
        (data) => {
          this.serviceParams = this.pipe.transform(data.params);
        },
        (error) => { },
        () => {
          if (this.serviceParams.redirect !== '') {
            this.redirect_check = true;
          }
          if (!refresh) {
            this.createForm();
            Object.keys(this.serviceParams).forEach((param) => {
              if (param === 'persistence' && this.serviceParams[param] !== '') {
                this.change(this.serviceParams[param], param, true);
              }
            }, this);
            if (this.redirect_check) {
              this.change(true, 'redirect_check');
              this.serviceValues = this.serviceForm.value;
            }
          }
        },
      );
  }

  changeFarmGuardian(): void {
    if (this.serviceParams.farmguardian) {
      this.service.delete(
        'farms/' + this.nameFarm + '/services/' + this.nameService + '/fg',
        this.serviceParams.farmguardian,
      )
        .subscribe(
          (data) => {
            this.resAction = data;
          },
          (error) => { },
          () => {
            if (!this.farmguardian) {
              this.showMessageTranslated('SYSTEM_MESSAGES.farm.farmguardian_disabled', 'toast');
            }
            this.serviceParams.farmguardian = '';
            this.addFarmGuardian();
          });
    } else {
      this.addFarmGuardian();
    }
  }

  addFarmGuardian(): void {
    if (this.farmguardian) {
      const param = { name: this.farmguardian };
      this.service.post('farms/' + this.nameFarm + '/services/' + this.nameService + '/fg', param)
        .subscribe(
          (data) => {
            this.resAction = data;
          },
          (error) => { },
          () => {
            this.serviceParams.farmguardian = this.farmguardian;
            this.showMessageTranslated('SYSTEM_MESSAGES.farm.farmguardian_changed', 'toast', param.name);
          });
    }
  }

  getDirtyValues(form) {
    const dirtyValues = {};

    Object.keys(form.controls).forEach((name) => {
      const currentControl = form.controls[name];

      if (currentControl.dirty) {
        if (currentControl.controls) {
          dirtyValues[name] = this.getDirtyValues(currentControl);
        } else {
          if (currentControl.value !== this.serviceValues[name]) {
            dirtyValues[name] = typeof currentControl.value !== 'boolean' ?
              currentControl.value : String(currentControl.value);
          }
        }
      }
    }, this);

    return dirtyValues;
  }

  onSubmit() {

    const submit = this.getDirtyValues(this.serviceForm);

    if (Object.keys(submit).length > 0) {
      this.denySubmit = true;
      this.service.update('farms/' + this.nameFarm + '/services', this.nameService, submit)
        .subscribe(
          (data) => {
            this.resParams = this.pipe.transform(data.params);
            this.resAction = data;
          },
          (error) => { this.denySubmit = false; },
          () => {
            Object.keys(this.resParams).forEach(function (param) {
              if (this.serviceForm.controls.hasOwnProperty(param)) {
                this.serviceForm.controls[param].setValue(this.resParams[param], { emitEvent: false });
                if (param === 'redirect' && this.resParams[param] !== '') {
                  this.serviceParams.backends = [];
                }
              }
            }, this);
            this.serviceValues = this.serviceForm.value;
            this.showMessageTranslated('SYSTEM_MESSAGES.farm.service_update', 'toast', this.nameService);
            this.restart.emit(this.resAction);
          });
    }
  }

  onAction(event) {
    if (event.action === 'delete') {
      if (this.showMessageTranslated('SYSTEM_MESSAGES.farm.backend_confirm_delete', 'window', event.data.id)) {
        this.service.deleteBackend(this.nameFarm, event.data.id, this.nameService)
          .subscribe(
            (data) => { this.resAction = data; },
            (error) => { },
            () => {
              this.serviceParams.backends.splice(this.serviceParams.backends.findIndex(i => i.id === event.data.id), 1);
              this.serviceParams.backends.forEach((bck, index) => {
                if (bck.id > event.data.id) {
                  this.serviceParams.backends[index].id -= 1;
                }
              });
              this.showMessageTranslated('SYSTEM_MESSAGES.farm.backend_deleted', 'toast', event.data.id);
              this.restart.emit(this.resAction);
            });
      }
    } else {
      const action = event.action.split(' ');
      this.service.actionBackend(this.nameFarm, event.data.id, action[0], action[1], this.nameService)
        .subscribe(
          (data) => { this.resAction = data; },
          (error) => { },
          () => {
            const object = event.data;
            object.status = this.resAction.params.action;
            this.serviceParams.backends[this.serviceParams.backends.findIndex(i => i.id === event.data.id)] = object;
            const actionMsg = event.action === 'maintenance' ? 'put in maintenance' : event.action + 'ed';
            this.showMessageTranslated('SYSTEM_MESSAGES.farm.backend_maintenance', 'toast', event.data.id, actionMsg);
          });
    }
  }


  createBackend(backend): void {
    this.service.post('/farms/' + this.nameFarm + '/services/' + this.nameService + '/backends', backend)
      .subscribe(
        (data) => { this.resAction = data; },
        (error) => { },
        () => {
          const items = [...this.serviceParams.backends];
          backend.id = this.serviceParams.backends.length;
          items.push(backend);
          this.serviceParams.backends = items;
          this.service.showToast('success', '', 'The backend has been created successfully.');
          this.restart.emit(this.resAction);
        });
  }

  editBackend(backend: any): void {
    this.service.update(
      '/farms/' + this.nameFarm + '/services/' + this.nameService + '/backends',
      backend.id,
      backend.object,
    ).subscribe(
      (data) => { this.resAction = data; },
      (error) => { },
      () => {
        const items = [...this.serviceParams.backends];
        Object.keys(backend.object).forEach((key) => {
          items[backend.index][key] = backend.object[key];
        });
        this.serviceParams.backends = items;
        this.showMessageTranslated('SYSTEM_MESSAGES.farm.backend_created', 'toast');
        this.restart.emit(this.resAction);
      });
  }

  change(value, param, inital = false) {
    switch (param) {
      case 'redirect_check':
        if (value) {
          this.serviceForm.controls.redirect.setValidators(
            [Validators.required, Validators.pattern('^http[s]?\\:\\/\\/.+')],
          );
          this.serviceForm.controls.redirect.setValue(this.serviceValues.redirect, { emitEvent: false });
          this.serviceForm.controls.redirecttype.setValue(this.serviceValues.redirecttype);
        } else {
          this.serviceForm.controls.redirect.setValidators([]);
          this.serviceForm.controls.redirect.setValue('', { emitEvent: false });
          this.serviceForm.controls.redirect.markAsDirty();
          this.serviceForm.controls.redirecttype.setValue('');
          this.serviceForm.controls.redirecttype.markAsDirty();
        }
        break;

      case 'persistence':
        if (value !== '') {
          if (inital) {
            this.serviceValues.ttl = this.serviceParams.ttl;
          }
          this.serviceForm.addControl(
            'ttl',
            new FormControl(this.serviceParams.ttl, [Validators.required, Validators.min(1)]),
          );
          if (value === 'URL' || value === 'COOKIE' || value === 'HEADER') {
            if (inital) {
              this.serviceValues.sessionid = this.serviceParams.sessionid;
            }
            this.serviceForm.addControl(
              'sessionid',
              new FormControl(this.serviceParams.sessionid, [Validators.required]),
            );
          } else {
            if (this.serviceForm.controls.sessionid) {
              this.serviceForm.removeControl('sessionid');
            }
          }
        } else {
          this.serviceForm.removeControl('ttl');
          if (this.serviceForm.controls.sessionid) {
            this.serviceForm.removeControl('sessionid');
          }
        }
        break;
    }
  }

  get sF() {
    return this.serviceForm.controls;
  }
}
