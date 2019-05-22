/**
  * @license
  * Zevenet Software License
  * This file is part of the Zevenet Load Balancer software.
  *
  * Copyright (C) 2019-today ZEVENET SL, Sevilla (Spain)
  * Licensed under the terms of the GNU Affero General Public License.
  * See License.txt in the project root for license information.
**/

import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'fa fa-desktop',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'LSLB',
    icon: 'fa fa-map-marked-alt',
    link: '/pages/lslb',
    children: [
      {
        title: 'Farms',
        link: '/pages/lslb/farms',
        pathMatch: 'part',
      },
      {
        title: 'SSL Certificates',
        link: '/pages/lslb/certificates',
        pathMatch: 'part',
      },
    ],
  },
  {
    title: 'DSLB',
    icon: 'fa fa-bezier-curve',
    link: '/pages/dslb',
    children: [
      {
        title: 'Farms',
        link: '/pages/dslb/farms',
        pathMatch: 'part',
      },
    ],
  },
  {
    title: 'Monitoring',
    icon: 'fa fa-chart-area',
    link: '/pages/monitoring',
    children: [
      {
        title: 'Graphs',
        link: '/pages/monitoring/graphs',
      },
      {
        title: 'Farm Stats',
        link: '/pages/monitoring/stats',
      },
      {
        title: 'Farmguardians',
        link: '/pages/monitoring/farmguardians',
        pathMatch: 'part',
      },
    ],
  },
  {
    title: 'Network',
    icon: 'fa fa-code-branch',
    link: '/pages/network',
    children: [
      {
        title: 'NIC',
        link: '/pages/network/nic',
        pathMatch: 'part',
      },
      {
        title: 'VLAN ',
        link: '/pages/network/vlan',
        pathMatch: 'part',
      },
      {
        title: 'Virtual interfaces ',
        link: '/pages/network/virtual',
        pathMatch: 'part',
      },
      {
        title: 'Gateway',
        link: '/pages/network/gateway',
        pathMatch: 'part',
      },
    ],
  },
  {
    title: 'System',
    icon: 'fa fa-cogs',
    link: '/pages/system',
    children: [
      {
        title: 'Remote Services',
        link: '/pages/system/remote-services',
      },
      {
        title: 'Backups',
        link: '/pages/system/backups',
        pathMatch: 'part',
      },
      {
        title: 'User',
        link: '/pages/system/user',
      },
      {
        title: 'Logs',
        link: '/pages/system/logs',
        pathMatch: 'part',
      },
      {
        title: 'License',
        link: '/pages/system/license',
      },
      {
        title: 'Support Save',
        link: '/pages/system/support-save',
      },
    ],
  },
];
