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
  selector: 'zevenet-dslb-farms-create',
  templateUrl: './farms-create.component.html',
})
export class FarmsCreateComponent implements OnInit {
	resAction: any;

	formGroup: FormGroup;

	interfaces: Array<any>;

	constructor(public service: ZevenetService,
		private fb: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
	) {
		this.formGroup = this.fb.group({
		    farmname: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9\-]+')]],
		    vip: ['', Validators.required],
		    profile: ['datalink'],
		});
	}

	ngOnInit(): void {
		this.getInterfaces();
	}

	getInterfaces(): void {
		this.service.getList('interfaces')
	      .subscribe((data) => {
	        this.interfaces  =  data.interfaces;
	    });
	}

	onSubmit(): void {
		this.service.post('farms', this.formGroup.getRawValue())
		.subscribe(
			(data) => { this.resAction = data; },
			(error) => { },
			() => {
				this.service.showToast(
					'success',
					 '',
					 'The farm <strong>' + this.formGroup.controls.farmname.value + '</strong> has been created successfully.',
				);
				this.router.navigate(['../'], {relativeTo: this.route});
			});
	}

  	get gF() { return this.formGroup.controls; }
}
