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
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ZevenetService } from '../../../@core/zevenet/services/zevenet.service';
import { ToBooleanPipe } from '../../pipes/to-boolean.pipe';
import { Toast, BodyOutputType } from 'angular2-toaster';
import { FarmRestartToastComponent } from '../../../@core/zevenet/components/toast/farm-restart-toast.component';
import isEqualWith from 'lodash/isEqualWith';

@Component({
  selector: 'zevenet-lslb-farms-update',
  templateUrl: './farms-update.component.html',
})
export class FarmsUpdateComponent implements OnInit, OnDestroy {

  name: string;

  radioModel: string = 'basic';

  farm: any;

  farmValues: any;

  services: Array<any>;

  backends: Array<any>;

  interfaces: Array<any>;

  ciphersHttp: Array<any> = [];

  certificatesHttp: Array<any> = [];

  readonly: boolean = false;

  profilesHttp: Array<string> = ['http', 'https'];

  locationsHttp: Array<any> = [
    { value: 'disabled', label: 'Disabled' },
    { value: 'enabled', label: 'Enabled' },
    { value: 'enabled-backends', label: 'Enabled amd compare backends' },
  ];

  verbsHttp: Array<any> = [
    { value: 'standardHTTP', label: 'Standard HTTP request' },
    { value: 'extendedHTTP', label: '+ extended HTTP request' },
    { value: 'standardWebDAV', label: '+ standard WebDAV verbs' },
    { value: 'MSextWebDAV', label: '+ MS extensions WebDAV verbs' },
    { value: 'MSRPCext', label: '+ MS RPC extensions verbs' },
  ];

  protocolsL4: Array<string> = [
    'all', 'tcp', 'udp', 'sip', 'ftp', 'tftp', 'sctp', 'amanda', 'h323', 'irc', 'netbios-ns', 'pptp', 'sane', 'snmp',
  ];

  nattypesL4: Array<string> = ['nat', 'dnat', 'dsr', 'stateless_dnat'];

  algorithms: Array<any> = [
    { label: 'Weight: connection linear dispatching by weight', value: 'weight' },
    { label: 'Source Hash: Hash per Source IP and Source Port', value: 'hash_srcip_srcport' },
    { label: 'Simple Source Hash: Hash per Source IP only', value: 'hash_srcip' },
    { label: 'Symmetric Hash: Round trip hash per IP and Port', value: 'symhash' },
    { label: 'Round Robin: Sequential backend selection', value: 'roundrobin' },
  ];

  persistenceTypesL4: Array<any> = [
    {label: 'No persistence', value: ''},
    {label: 'IP: Source IP', value: 'ip'},
    {label: 'Port: Source Port', value: 'srcport'},
    {label: 'MAC: Source MAC', value: 'srcmac'},
    {label: 'Source IP and Source Port', value: 'srcip_srcport'},
    {label: 'Source IP and Destination Port', value: 'srcip_dstport'},
  ];

  farmguardians: Array<any>;

  farmguardian: any;

  globalForm: FormGroup;

  resAction: any;

  resParams: any = {};

  nameService: string;

  displayDialog: boolean = false;

  denySubmit: boolean = true;

  toastRestart: Toast = {
    type: 'warning',
    timeout: 0,
    bodyOutputType: BodyOutputType.Component,
    body: FarmRestartToastComponent,
    data: {},
  };

  columns: Array<any> = [
    { field: 'id', header: 'ID', width: '5%', editable: false },
    { field: 'ip', header: 'IP', width: '25%', editable: true },
    { field: 'port', header: 'Port', width: '16%', editable: true },
    { field: 'priority', header: 'Priority', width: '16%', editable: true },
    { field: 'weight', header: 'Weight', width: '16%', editable: true },
  ];

  actionsList: Array<any> = [
    { action: 'maintenance', icon: 'fa-stop' },
    { action: 'up', icon: 'fa-play' },
    { action: 'delete', icon: 'fa-trash' },
  ];

  constructor(private service: ZevenetService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private pipe: ToBooleanPipe,
  ) { }

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

  ngOnInit() {
    this.name = this.route.snapshot.paramMap.get('name');
    this.getFarm();
    this.toastRestart.data.name = this.name;

    this.service.changeLang()
      .subscribe((data) => {
        this.persistenceTypesL4 = [...this.persistenceTypesL4];
        this.algorithms = [...this.algorithms];
      });
  }

  isNecessaryRestart(object: any) {
    if (object.hasOwnProperty('status')) {
      if (object.status === 'needed restart') {
        this.farm.status = 'needed restart';
        this.service.alertRestart(this.toastRestart);
      }
    }
  }

  createForm(profile: string) {
    if (profile !== 'l4xnat') {
      this.globalForm = new FormGroup(this.fb.group({
        newfarmname: [this.name, [Validators.required, Validators.pattern('[A-Za-z0-9\-]+')]],
        vip: [this.farm.vip, [Validators.required]],
        vport: [this.farm.vport, [Validators.required]],
        listener: [this.farm.listener, [Validators.required, Validators.pattern('(http|https)')]],
        certificate: [this.farm.certlist ? this.farm.certlist[0].file : ''],
        disable_sslv2: [this.farm.disable_sslv2],
        disable_sslv3: [this.farm.disable_sslv3],
        disable_tlsv1: [this.farm.disable_tlsv1],
        disable_tlsv1_1: [this.farm.disable_tlsv1_1],
        disable_tlsv1_2: [this.farm.disable_tlsv1_2],
        cipherc: [this.farm.cipherc],
        ciphers: [this.farm.ciphers],
        rewritelocation: [this.farm.rewritelocation, Validators.required],
        httpverb: [this.farm.httpverb, Validators.required],
        contimeout: [this.farm.contimeout, [Validators.required, Validators.min(1)]],
        restimeout: [this.farm.restimeout, [Validators.required, Validators.min(1)]],
        resurrectime: [this.farm.resurrectime, [Validators.required, Validators.min(1)]],
        reqtimeout: [this.farm.reqtimeout, [Validators.required, Validators.min(1)]],
        error414: [this.farm.error414],
        error500: [this.farm.error500],
        error501: [this.farm.error501],
        error503: [this.farm.error503],
      }).controls, { updateOn: 'blur' });
      this.globalForm.get('listener').valueChanges.subscribe((val) => {
        this.changeListener(val);
      });

    } else {
      this.globalForm = new FormGroup(this.fb.group({
        newfarmname: [this.name, [Validators.required, Validators.pattern('^[A-Za-z0-9\\-]{1,256}$')]],
        vip: [this.farm.vip, [Validators.required]],
        vport: [this.farm.vport, [Validators.required, Validators.pattern('(^\\d+$|^\\d+((\\,|\\:)\\d+)+$|^\\*$)')]],
        algorithm: [this.farm.algorithm, Validators.required],
        nattype: [this.farm.nattype, Validators.required],
        protocol: [this.farm.protocol, Validators.required],
        persistence: [this.farm.persistence],
        ttl: [this.farm.ttl, Validators.min(1)],
      }).controls, {updateOn: 'blur'});
      this.getLangTranslated('LSLB.farms.l4xnat.service_settings.persistence', this.persistenceTypesL4);
      this.getLangTranslated('LSLB.farms.l4xnat.service_settings.algorithms', this.algorithms);
    }
    this.farmguardian = this.farm.farmguardian;
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

  changeListener(value): void {
    const param = { listener: value };
    this.service.update('farms', this.name, param)
      .subscribe(
        (data) => {
          this.resParams = this.pipe.transform(data.params);
          this.resAction = data;
        },
        (error) => { },
        () => {
          if (value === 'https' && this.ciphersHttp.length === 0) {
            this.service.getList('ciphers')
              .subscribe((data) => { this.ciphersHttp = data.params; });

            this.service.getList('certificates')
              .subscribe(
                (data) => { this.certificatesHttp = data.params; });
          }
          Object.keys(this.resParams).forEach((key) => {
            if (key === 'certlist') {
              this.globalForm.controls.certificate.setValue(this.resParams[key][0].file, {emitEvent: false});
            } else if (this.globalForm.controls.hasOwnProperty(key)) {
              this.globalForm.controls[key].setValue(this.resParams[key], {emitEvent: false});
            }
          }, this);
          this.valdiatorsByProfile(value);
          this.showMessageTranslated('SYSTEM_MESSAGES.farm.profile_changed', 'toast', value);
          this.isNecessaryRestart(this.resAction);
        });
  }

  changeFarmGuardian(): void {
    if (this.farm.farmguardian) {
      this.service.delete('farms/' + this.name + '/fg', this.farm.farmguardian)
        .subscribe(
          (data) => {
            this.resAction = data;
          },
          (error) => { },
          () => {
            if (!this.farmguardian) {
              this.showMessageTranslated('SYSTEM_MESSAGES.farm.farmguardian_disabled', 'toast');
            }
            this.farm.farmguardian = '';
            this.addFarmGuardian();
          });
    } else {
      this.addFarmGuardian();
    }
  }

  addFarmGuardian(): void {
    if (this.farmguardian) {
      const param = { name: this.farmguardian };
      this.service.post('farms/' + this.name + '/fg', param)
        .subscribe(
          (data) => {
            this.resAction = data;
          },
          (error) => { },
          () => {
            this.farm.farmguardian = this.farmguardian;
            this.showMessageTranslated('SYSTEM_MESSAGES.farm.farmguardian_changed', 'toast', param.name);
          });
    }
  }

  valdiatorsByProfile(profile): void {
    if (profile === 'https') {
      Object.keys(this.globalForm.controls).forEach(key => {
        if (key.match(/^disable\_/) || key === 'ciphers' || key === 'certificate')
          this.globalForm.controls[key].setValidators([Validators.required]);
      });
    } else {
      Object.keys(this.globalForm.controls).forEach(key => {
        if (key.match(/^disable\_/) || key === 'ciphers' || key === 'certificate')
          this.globalForm.controls[key].setValidators([]);
      });
    }
  }

  getFarm(refresh = false): void {
    this.service.getFarm(this.name)
      .subscribe(
        (data) => {
          this.services = data.services;
          this.farm = this.pipe.transform(data.params);
          this.backends = data.backends;
        },
        (error) => { },
        () => {
          if (!refresh) {
            this.createForm(this.farm.listener);

            if (this.farm.status !== 'down') {
              this.readonly = true;
            }
            if (this.farm.listener === 'https') {

              this.service.getList('ciphers')
                .subscribe((data) => { this.ciphersHttp = data.params; });

              this.service.getList('certificates')
                .subscribe((data) => { this.certificatesHttp = data.params; });
              this.valdiatorsByProfile('https');
            }

            if (this.farm.listener === 'l4xnat' || this.services.length > 0) {
              this.service.getList('monitoring/fg')
                .subscribe((data) => {
                  this.farmguardians = data.params;
                  this.farmguardians.unshift({ name: '' });
                });
            }
            this.isNecessaryRestart(this.farm);
          }
        });
    if (!refresh) {
      this.service.getList('interfaces')
        .subscribe((data) => {
          this.interfaces = data.interfaces;
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
          if (currentControl.value !== this.farmValues[name]) {
            dirtyValues[name] = typeof currentControl.value !== 'boolean' ?
              currentControl.value : String(currentControl.value);
          }
        }
      }
    }, this);

    return dirtyValues;
  }

  onSubmit(form) {
    const submit = this.getDirtyValues(this[form]);
    if (Object.keys(submit).length > 0) {
      this.denySubmit = true;

      if (submit['certificate']) {
        const cert = submit['certificate'];
        this.service.applyCert(this.name, cert)
          .subscribe((data) => {
            this.resAction = data;
            this.farmValues.certificate = cert;
          },
            (error) => {
              this.denySubmit = false;
            },
            () => {
              if (Object.keys(submit).length === 0) {
                this.showMessageTranslated('SYSTEM_MESSAGES.farm.updated', 'toast');
                this.isNecessaryRestart(this.resAction);
              }
            });
      }
      if (submit['certificate'])
        delete submit['certificate'];
      if (Object.keys(submit).length > 0) {
        this.denySubmit = true;
        this.service.update('farms', this.name, submit)
          .subscribe(
            (data) => {
              this.resParams = this.pipe.transform(data.params);
              this.resAction = data;
            },
            (error) => {
              this.denySubmit = false;
            },
            () => {
              Object.keys(this.resParams).forEach(function (param) {
                if (param === 'certlist') {
                  this.globalForm.controls.certificate.setValue(this.resParams[param][0].file, { emitEvent: false });
                } else {
                  if (param === 'newfarmname') {
                    this.name = this.resParams.newfarmname;
                    window.history.pushState({}, '', `/pages/lslb/farms/edit/${this.name}`);
                  }
                  if (this.globalForm.controls.hasOwnProperty(param))
                    this.globalForm.controls[param].setValue(this.resParams[param], {emitEvent: false});
                }
              }, this);
              this.farmValues = this.globalForm.value;

              this.showMessageTranslated('SYSTEM_MESSAGES.farm.updated', 'toast');
              this.isNecessaryRestart(this.resAction);
            });
      }
    }
  }

  createBackend(backend): void {
    this.service.post('/farms/' + this.name + '/backends', backend)
      .subscribe(
        (data) => { this.resAction = data; },
        (error) => { },
        () => {
          const items = [...this.backends];
          backend = this.resAction.params;
          items.push(backend);
          this.backends = items;
          this.showMessageTranslated('SYSTEM_MESSAGES.farm.backend_created', 'toast');
        });
  }

  editBackend(backend: any): void {
    this.service.update('/farms/' + this.name + '/backends', backend.id, backend.object)
      .subscribe(
        (data) => { this.resAction = data; },
        (error) => { },
        () => {
          const items = [...this.backends];
          Object.keys(backend.object).forEach((key) => {
            items[backend.index][key] = backend.object[key];
          });
          this.backends = items;
          this.showMessageTranslated('SYSTEM_MESSAGES.farm.backend_created', 'toast');
        });
  }
  /* BACKENDS L4 */

  onAction(event) {
    if (event.action === 'delete') {
      if (this.showMessageTranslated('SYSTEM_MESSAGES.farm.backend_confirm_delete', 'window', event.data.id)) {
        this.service.deleteBackend(this.name, event.data.id)
          .subscribe(
            (data) => { this.resAction = data; },
            (error) => { },
            () => {
              this.backends.splice(this.backends.findIndex(i => i.id === event.data.id), 1);
              this.showMessageTranslated('SYSTEM_MESSAGES.farm.backend_deleted', 'toast', event.data.id);
            });
      }
    } else {
      const action = event.action.split(' ');
      this.service.actionBackend(this.name, event.data.id, action[0], action[1])
        .subscribe(
          (data) => { this.resAction = data; },
          (error) => { },
          () => {
            const object = event.data;
            object.status = this.resAction.params.action;
            this.backends[this.backends.findIndex(i => i.id === event.data.id)] = object;
            let actionMsg = action[0] === 'up' ? 'upped' : action[0];
            this.service.translateLang('STATUS.' + actionMsg, actionMsg)
              .subscribe((translated) => {
                actionMsg = translated;
                this.showMessageTranslated(
                  'SYSTEM_MESSAGES.farm.backend_maintenance',
                  'toast',
                  event.data.id,
                  actionMsg,
                );
              });
          });
    }
  }

  createService(): void {
    const param = { id: this.nameService };
    this.service.post('farms/' + this.name + '/services', param)
      .subscribe(
        (data) => { this.resAction = data; },
        (error) => { },
        () => {
          this.nameService = '';
          this.displayDialog = false;
          if (!this.farmguardians) {
            this.service.getList('monitoring/fg')
              .subscribe((data) => {
                this.farmguardians = data.params;
                this.farmguardians.unshift({ name: '' });
              });
          }
          this.services.push(param);
          this.showMessageTranslated('SYSTEM_MESSAGES.farm.service_created', 'toast', param.id);
          this.isNecessaryRestart(this.resAction);
        });
  }
  deleteService(event, name, index): void {
    event.preventDefault();
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete the service ' + name + '?')) {
      this.service.delete('farms/' + this.name + '/services', name)
        .subscribe(
          (data) => { this.resAction = data; },
          (error) => { },
          () => {
            this.services.splice(index, 1);
            this.showMessageTranslated('SYSTEM_MESSAGES.farm.service_deleted', 'toast', name);
            this.isNecessaryRestart(this.resAction);
          });
    }
  }

  get gF() {
    return this.globalForm.controls;
  }

  ngOnDestroy() {
    this.service.clearToast();
  }
}
