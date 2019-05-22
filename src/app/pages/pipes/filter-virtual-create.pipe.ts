/**
  * @license
  * Zevenet Software License
  * This file is part of the Zevenet Load Balancer software.
  *
  * Copyright (C) 2019-today ZEVENET SL, Sevilla (Spain)
  * Licensed under the terms of the GNU Affero General Public License.
  * See License.txt in the project root for license information.
**/

import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
 name: 'filterVirtualCreate',
})

export class FilterVirtualCreate implements PipeTransform {
  transform(value): any {
    return value.filter(item => {
      return (item.type === 'nic' && item.is_slave === 'false' && item.ip !== '')
      	|| ((item.type === 'bond'  || item.type === 'vlan' ) && item.ip !== '');
    });
  }
}
