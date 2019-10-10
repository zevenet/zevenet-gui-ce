/**
  * @license
  * Zevenet Software License
  * This file is part of the Zevenet Load Balancer software.
  *
  * Copyright (C) 2019-today ZEVENET SL, Sevilla (Spain)
  * Licensed under the terms of the GNU Affero General Public License.
  * See License.txt in the project root for license information.
**/

import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component } from '@angular/core';

import { Toast } from 'angular2-toaster';
import { ZevenetService } from '../../../zevenet/services/zevenet.service';

@Component({
  selector: 'zevenet-action-toast-component',
  template: `
    <div class="row">
      <div class="col-9">
        <div *ngIf="title" [class]="titleClass" [attr.aria-label]="title">
          <b>{{ title }}</b>
        </div>
        <div *ngIf="message" role="alert" aria-live="polite"
          [class]="messageClass" [innerHTML]="message">
        </div>
      </div>
      <div class="col-12 mt-2">
        <a class="btn btn-success btn-sm" (click)="actionEvt($event)">
          {{ undoString }}
        </a>
        <a (click)="remove($event)" class="btn btn-default btn-sm ml-2">
          Close
        </a>
      </div>
    </div>
  `,
  animations: [
    trigger('flyInOut', [
      state('inactive', style({
        display: 'none',
        opacity: 0,
      })),
      transition('inactive => active', animate('400ms ease-out', keyframes([
        style({
          transform: 'translate3d(100%, 0, 0) skewX(-30deg)',
          opacity: 0,
        }),
        style({
          transform: 'skewX(20deg)',
          opacity: 1,
        }),
        style({
          transform: 'skewX(-5deg)',
          opacity: 1,
        }),
        style({
          transform: 'none',
          opacity: 1,
        }),
      ]))),
      transition('active => removed', animate('400ms ease-out', keyframes([
        style({
          opacity: 1,
        }),
        style({
          transform: 'translate3d(100%, 0, 0) skewX(30deg)',
          opacity: 0,
        }),
      ]))),
    ]),
  ],
  preserveWhitespaces: false,
})
export class FarmRestartToastComponent {

  undoString = 'Restart';
  title = 'Needed restart';
  message = 'There\'re changes that need to be applied, restart the farm to apply them!';
  titleClass = 'mb-1';
  messageClass = '';
  toast: Toast;

  actionResp: any;

  constructor(protected service: ZevenetService) {
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

  actionEvt(event: Event) {
    this.service.clearToast(this.toast.toastId);
    this.service.actionFarm(this.toast.data.name, 'restart')
      .subscribe(
        (data) => { this.actionResp  =  data; },
        (error) => {},
        () => this.showMessageTranslated('SYSTEM_MESSAGES.farm.restarted', 'toast', this.toast.data.name));
  }
  remove(event: Event) {
    this.service.clearToast(this.toast.toastId);
  }
}
