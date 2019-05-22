/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/**
  * @license
  * Zevenet Software License
  * This file is part of the Zevenet Load Balancer software.
  *
  * Copyright (C) 2019-today ZEVENET SL, Sevilla (Spain)
  * Licensed under the terms of the GNU Affero General Public License.
  * See License.txt in the project root for license information.
**/

import { Component } from '@angular/core';
import { ToasterConfig } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';


@Component({
  selector: 'zevenet-console-central',
  template: `<router-outlet></router-outlet>
	<toaster-container [toasterconfig]="config"></toaster-container>
  `,
})
export class AppComponent {


  config: ToasterConfig = new ToasterConfig({
    positionClass: 'toast-bottom-right',
    timeout: 5000,
    newestOnTop: true,
    tapToDismiss: false,
    preventDuplicates: true,
    animation: 'fade',
    limit: 10,
  });

}
