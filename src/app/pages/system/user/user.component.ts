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
import { FormControl, FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ZevenetService } from '../../../@core/zevenet/services/zevenet.service';
import isEqual from 'lodash/isEqual';

@Component({
  selector: 'zevenet-system-user',
  templateUrl: './user.component.html',
})
export class UserComponent implements  OnInit {

  user: any;

  userValues: any;

  actionResp: any;

  resParams: any;

  resAction: any;

  formUser: FormGroup;

  denySubmit: boolean = true;

  changePass: boolean = false;

  constructor(private service: ZevenetService, private fb: FormBuilder) { }

  ngOnInit() {
    this.getUser();
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
    const zapi_key = this.user.zapi_permissions ? '************' : '';
    this.formUser = new FormGroup(this.fb.group({
      zapi_permissions: [this.user.zapi_permissions],
      zapikey: [zapi_key],
    }).controls, {updateOn: 'blur'});

    this.userValues = this.formUser.value;
    this.formUser.valueChanges.subscribe((val) => {
      this.denySubmit = isEqual(val, this.userValues);
    });
  }

  getUser(): void {
    this.service.getObject('system', 'users')
      .subscribe((data) => {
        this.user  =  data.params;
        this.user.zapi_permissions = JSON.parse(data.params.zapi_permissions);
        this.createForm();
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
          if (currentControl.value !== this.userValues[name]) {
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
      delete submit['confirmPass'];
      this.denySubmit = true;
      this.service.post('system/users', submit)
        .subscribe(
          (data) => {
            this.resParams = data.params;
            this.resAction = data;
          },
          (error) => {
            this.denySubmit = false;
          },
          () => {
            if (this.changePass) {
              this.changePass = false;
              this.formUser.controls.password.setValue('');
              this.formUser.controls.newpassword.setValue('');
              this.formUser.controls.confirmPass.setValue('');
            }
            this.userValues = this.formUser.value;
            this.showMessageTranslated('SYSTEM_MESSAGES.system.user_updated', 'toast');
          });
    }
  }

  enableChangePass(event) {
    event.preventDefault();

    this.formUser.addControl('password', new FormControl('', Validators.required));
    this.formUser.addControl('newpassword', new FormControl('', Validators.required));
    this.formUser.addControl(
      'confirmPass',
      new FormControl('', [Validators.required, UserComponent.checkPasswords(this.formUser.controls.newpassword)]),
    );

    this.changePass = true;
  }


  generateKey(): void {
    const length = 65;
    const mask = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = length; i > 0; --i) {
      result += mask[Math.floor(Math.random() * mask.length)];
    }
    this.user.zapikey = result;
    this.formUser.controls.zapikey.setValue(result);
  }

  get gF() {
    return this.formUser.controls;
  }

  static checkPasswords (newpassword: any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const newpass = newpassword.value;
      const confirmPass = control.value;

      if (newpass === confirmPass ) {
        return null;
      } else {
        return {notSame: true};
      }
    };
  }
}
