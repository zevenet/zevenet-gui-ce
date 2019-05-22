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
  selector: 'zevenet-system-backups-upload',
  templateUrl: './backups-upload.component.html',
})
export class BackupsUploadComponent {
	resFile: any;

	formGroup: FormGroup;

	file: any;

	nameFile: string = '';

	constructor(private service: ZevenetService,
		private fb: FormBuilder,
		private cd: ChangeDetectorRef,
		private router: Router,
		private route: ActivatedRoute,
	) {
		this.formGroup = this.fb.group({
			name: ['', Validators.required],
		    file: ['', Validators.required],
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
  }	onSubmit(): void {
		this.service.upload('system/backup', this.formGroup.controls.name.value, this.formGroup.controls.file.value)
	  	.subscribe(
	  		(data) => {
		  		this.resFile = data;
		  	},
		  	(error) => {},
		  	() => {
					this.showMessageTranslated('SYSTEM_MESSAGES.system.backup_uploaded', 'toast', this.formGroup.controls.name.value);
				this.router.navigate(['../'], {relativeTo: this.route});
		  	});
	}

	readFile(event): void {
		if (event.target.files && event.target.files.length > 0) {
			const reader = new FileReader();
			this.nameFile = event.target.files[0].name;
			reader.readAsBinaryString(event.target.files[0]);

			reader.onload = () => {
			  const result = reader.result;
			  const file = btoa(<string>result);
			  this.formGroup.controls.file.setValue(file);
			  this.cd.markForCheck();
			};
		}
	}
}
