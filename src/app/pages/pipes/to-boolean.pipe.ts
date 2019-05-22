/**
  * @license
  * Zevenet Software License
  * This file is part of the Zevenet Load Balancer software.
  *
  * Copyright (C) 2019-today ZEVENET SL, Sevilla (Spain)
  * Licensed under the terms of the GNU Affero General Public License.
  * See License.txt in the project root for license information.
**/

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'toBoolean'})
export class ToBooleanPipe implements PipeTransform {

    transform(value: any) {
        const result = {};
        if (value) {
            Object.keys(value).map(function(param) {
            	if (value[param] === 'true' || value[param] === 'false') {
            		result[param] = JSON.parse(value[param]);
            	} else {
            		result[param] = value[param];
            	}
            });
        }

        return result;
    }
}
