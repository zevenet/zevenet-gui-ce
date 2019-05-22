/**
  * @license
  * Zevenet Software License
  * This file is part of the Zevenet Load Balancer software.
  *
  * Copyright (C) 2019-today ZEVENET SL, Sevilla (Spain)
  * Licensed under the terms of the GNU Affero General Public License.
  * See License.txt in the project root for license information.
**/

import { Injectable } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';


@Injectable({
providedIn: 'root',
})

export class AlertService {

  constructor(private toasterService: ToasterService) {
  }
  showToast(type: string, title: string, body: string) {
    const toast: Toast = {
      type: type,
      title: title,
      body: body,
      timeout: 5000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.toasterService.popAsync(toast);
  }
  clearToast(id?) {
    if (id) {
      this.toasterService.clear(id);
    } else {
      this.toasterService.clear();
    }
  }

  alertRestart(toast) {
    this.toasterService.pop(toast);
  }

  alertForce(toast) {
    this.toasterService.pop(toast);
  }
}
