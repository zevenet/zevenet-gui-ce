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
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ZevenetService } from '../../../@core/zevenet/services/zevenet.service';

@Component({
  selector: 'zevenet-lslb-certificates-csr',
  templateUrl: './certificates-csr.component.html',
})
export class CertificatesCsrComponent {
	resAction: any;

	formGroup: FormGroup;

	constructor(private service: ZevenetService,
		private fb: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
	) {
		this.formGroup = this.fb.group({
	    name: ['', Validators.required],
	    locality: ['', Validators.required],
	    country: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
	    state: ['', Validators.required],
	    fqdn: ['', Validators.required],
	    organization: ['', Validators.required],
	    division: ['', Validators.required],
	    mail: ['', [Validators.required, Validators.email]],
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

	onSubmit(): void {
		this.service.post('certificates', this.formGroup.getRawValue())
		.subscribe(
			(data) => { this.resAction = data; },
			(error) => { },
			() => {
				this.showMessageTranslated(
					'SYSTEM_MESSAGES.certificate.csr_generated', 'toast', this.formGroup.controls.name.value,
					);
				this.router.navigate(['../'], {relativeTo: this.route});
			});
	}

	get gF() {
		return this.formGroup.controls;
	}
}
