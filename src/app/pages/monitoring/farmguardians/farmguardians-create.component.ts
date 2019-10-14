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
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ZevenetService } from '../../../@core/zevenet/services/zevenet.service';

@Component({
  selector: 'zevenet-monitoring-farmguardians-create',
  templateUrl: './farmguardians-create.component.html',
})
export class FarmguardiansCreateComponent {
	resAction: any;

	formGroup: FormGroup;

	ruleList: Array<any>;

	copy: boolean = false;

	ruleCopy: any;

	constructor(private service: ZevenetService,
		private fb: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
	) {
		this.formGroup = this.fb.group({
		    name: ['', Validators.required],
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
	toggleCopy(status) {
		this.copy = status;
		if (this.copy) {
			this.formGroup.addControl('copy_from', new FormControl('', Validators.required));
			if (!this.ruleList) {
				this.service.getList('monitoring/fg')
			      .subscribe((data) => {
			        this.ruleList  =  data.params;
			      });
		    }
		} else {
			this.formGroup.removeControl('copy_from');
		}
	}

	get gF() { return this.formGroup.controls; }

	onSubmit(): void {
		if (this.formGroup.invalid) {
			return;
		}
	  this.service.post('monitoring/fg', this.formGroup.getRawValue())
	  	.subscribe(
	  		(data) => { this.resAction = data; },
	  		(error) => { },
	  		() => {
				this.showMessageTranslated(
					'SYSTEM_MESSAGES.farm.farmguardian_created',
					'toast',
					this.formGroup.controls.name.value,
				);
	  			this.router.navigate(['../'], {relativeTo: this.route});
	  		});
	}
}
