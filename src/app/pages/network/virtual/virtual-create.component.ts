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
  selector: 'zevenet-network-virtual-create',
  templateUrl: './virtual-create.component.html',
})
export class VirtualCreateComponent implements OnInit {
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
		    name: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
		    ip: ['', Validators.required],
		});
	}

	ngOnInit(): void {
		this.getInterfaces();
	}

	showMessageTranslated(textlang: string, func: string, param?: any, param2?: any): any {
    this.service.interpolateLang(textlang, {param: param, param2: param2})
    .then(data =>  {
      if (func === 'toast') {
        this.service.showToast('success', '', data);
      } else if (func === 'window') {
        window.confirm(data);
      }
    });
  }

	getInterfaces(): void {
		this.service.getList('interfaces')
	      .subscribe((data) => {
	        this.interfaces  =  data.interfaces;
	    });
	}

	onSubmit(): void {
		const submit = this.formGroup.getRawValue();
		submit.name = this.parent + ':' + this.gF.name.value;
	  	this.service.post('interfaces/virtual', submit)
	  		.subscribe(
	  		(data) => { this.resAction = data; },
	  		(error) => { },
	  		() => {
				this.showMessageTranslated(
					'SYSTEM_MESSAGES.network.virtual_interface_created',
					'toast',
					this.formGroup.controls.name.value,
				);
	  			this.router.navigate(['../'], {relativeTo: this.route});
	  		});
	}

	get gF() { return this.formGroup.controls; }
}
