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
import { Router, ActivatedRoute } from '@angular/router';
import { ZevenetService } from '../../../@core/zevenet/services/zevenet.service';

@Component({
  selector: 'zevenet-system-backups-create',
  templateUrl: './backups-create.component.html',
})
export class BackupsCreateComponent implements OnInit {
	resAction: any;

	formGroup: FormGroup;

	interfaces: Array<any>;

	constructor(private service: ZevenetService,
		private fb: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
	) {
		this.formGroup = this.fb.group({
		    name: ['', [Validators.required]],
		});
	}

	ngOnInit(): void {
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
  }	onSubmit(): void {
	  this.service.post('system/backup', this.formGroup.getRawValue())
	  	.subscribe(
	  		(data) => { this.resAction = data; },
	  		(error) => { },
	  		() => {
					this.showMessageTranslated('SYSTEM_MESSAGES.system.backup_created', 'toast', this.formGroup.controls.name.value);
	  			this.router.navigate(['../'], {relativeTo: this.route});
	  		});
	}

	get gF() { return this.formGroup.controls; }
}
