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
import { OnInit } from '@angular/core';
import { ZevenetService } from '../../../zevenet/services/zevenet.service';

@Component({
  selector: 'zevenet-action-toast-component',
  template: `
    <div class="row">
      <div class="col-11">
        <div *ngIf="title" [class]="titleClass" [attr.aria-label]="title">
          <b>{{ title }}</b>
        </div>
        <div *ngIf="toast?.data.message" role="alert" aria-live="polite"
          [class]="messageClass" [innerHTML]="toast.data.message">
        </div>
      </div>
      <div class="col-12 mt-2">
        <a class="btn btn-success btn-sm" (click)="actionEvt($event)">
          {{ undoString }}
        </a>
        <a (click)="remove($event)" class="btn btn-default btn-sm">
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
export class UpdateForceToastComponent implements OnInit {

  undoString = 'Force Changes';
  title = 'Needed confirmation';
  titleClass = 'mb-1';
  messageClass = '';
  toast: Toast;

  actionResp: any;

  constructor(protected service: ZevenetService) {
  }

  ngOnInit() {
    this.replaceMessage();
  }

  actionEvt(event: Event) {
    this.toast.data.params['force'] = 'true';
    this.service.update(this.toast.data.url, this.toast.data.name, this.toast.data.params)
      .subscribe(
        (data) => { this.actionResp  =  data.params; },
        (error) => {
          delete this.toast.data.params['force'];
          this.toast.data['success'] = false;
        },
        () => {
          this.toast.data['success'] = true;
          delete this.toast.data.params['force'];
          Object.keys(this.actionResp).forEach(function(param) {
            if (this.toast.data.params.hasOwnProperty(param))
              this.toast.data.params[param] = this.actionResp[param];
          }, this);
          this.service.clearToast(this.toast.toastId);
          this.service.showToast(
						'success',
						 '',
						 'The ' + this.toast.data.object + ' <strong>'
              + this.toast.data.name + '</strong> has been updated successfully.',
					);
        });
  }
  remove(event: Event) {
    this.service.clearToast(this.toast.toastId);
  }

  replaceMessage() {
    this.toast.data.message = this.toast.data.message.replace(
      'If you are sure, repeat with parameter \'force\'',
      '\nAre you sure you want to modify the ' + this.toast.data.name + ' ' + this.toast.data.object + '?',
    );
  }
}
