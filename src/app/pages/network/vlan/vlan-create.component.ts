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
  selector: 'zevenet-network-vlan-create',
  templateUrl: './vlan-create.component.html',
})
export class VlanCreateComponent implements OnInit {
	resAction: any;

	interfaces: any;

	formGroup: FormGroup;

	parent: string;

	slavesList: Array<any>;

	constructor(private service: ZevenetService,
		private fb: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
	) {
		this.formGroup = this.fb.group({
		    name: ['', Validators.required],
		    ip: ['', Validators.required],
		    netmask: ['', Validators.required],
		    gateway: [''],
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
		const tag = this.gF.name.value;
		const params = this.formGroup.getRawValue();
		params.name = this.parent + '.' + tag;
		if (!params.gateway)
			delete params.gateway;
	  	this.service.post('interfaces/vlan', params)
	  		.subscribe(
	  		(data) => { this.resAction = data; },
	  		(error) => {
	  			this.gF.name.setValue(tag);
	  		},
	  		() => {
	  			this.service.showToast(
						'success',
						 '',
						 'The <strong>' + this.formGroup.controls.name.value + '</strong> VLAN has been created successfully.',
					);
	  			this.router.navigate(['../'], {relativeTo: this.route});
	  		});
	}

	filterInput(event): boolean {
		const keyCode = ('which' in event) ? event.which : event.keyCode;

	    const isNotWanted = (keyCode === 69 || keyCode === 190 || keyCode === 109 ||
	    	keyCode === 110 || keyCode === 188 || keyCode === 189 || keyCode === 107);

	    if (isNotWanted)
	    	return false;
	}

	get gF() { return this.formGroup.controls; }
}
