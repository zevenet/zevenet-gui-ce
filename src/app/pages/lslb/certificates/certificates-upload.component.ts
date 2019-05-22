/**
  * @license
  * Zevenet Software License
  * This file is part of the Zevenet Load Balancer software.
  *
  * Copyright (C) 2019-today ZEVENET SL, Sevilla (Spain)
  * Licensed under the terms of the GNU Affero General Public License.
  * See License.txt in the project root for license information.
**/

import { Component, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ZevenetService } from '../../../@core/zevenet/services/zevenet.service';

@Component({
  selector: 'zevenet-lslb-certificates-upload',
  templateUrl: './certificates-upload.component.html',
})
export class CertificatesUploadComponent {
	resFile: any;

	formGroup: FormGroup;

	names: Array<string> = [];

	constructor(private service: ZevenetService,
		private fb: FormBuilder,
		private cd: ChangeDetectorRef,
		private router: Router,
		private route: ActivatedRoute,
	) {
		this.formGroup = this.fb.group({
		    file: [[], Validators.required],
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
		for (let i = 0; i < this.formGroup.controls.file.value.length; i++) {
			const name = this.names[i];
			this.service.upload('certificates', name, this.formGroup.controls.file.value[i])
		  	.subscribe(
		  		(data) => {
			  		this.resFile = data;
			  	},
			  	(error) => {},
			  	() => {
			  		this.successUpload(name);
			  	});
		}
		this.router.navigate(['../'], {relativeTo: this.route});
	}

	onFileSelected(event): void {
		this.names = [];
		this.formGroup.controls.file.setValue([]);
		if (event.target.files && event.target.files.length) {
			for (let i = 0; i < event.target.files.length; i++) {
				this.readFile(event.target.files[i]);
			}
			this.formGroup.controls.file.markAsDirty();
		}
	}

	readFile(file): void {
		const reader = new FileReader();
		this.names.push(file.name);

		reader.readAsText(file);

		reader.onload = () => {
		  this.formGroup.controls.file.value.push(reader.result);
		  this.cd.markForCheck();
		};
	}

	successUpload(name): void {
		this.showMessageTranslated('SYSTEM_MESSAGES.certificate.uploaded', 'toast', name);
	}

}
