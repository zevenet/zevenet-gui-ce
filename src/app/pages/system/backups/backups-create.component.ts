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

	onSubmit(): void {
	  this.service.post('system/backup', this.formGroup.getRawValue())
	  	.subscribe(
	  		(data) => { this.resAction = data; },
	  		(error) => { },
	  		() => {
	  			this.service.showToast(
					'success',
					 '',
					 'The backup <strong>' + this.formGroup.controls.name.value + '</strong> has been created successfully.',
				);
	  			this.router.navigate(['../'], {relativeTo: this.route});
	  		});
	}

	get gF() { return this.formGroup.controls; }
}
