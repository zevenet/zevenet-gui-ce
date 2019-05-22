/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/**
  * @license
  * Zevenet Software License
  * This file is part of the Zevenet Load Balancer software.
  *
  * Copyright (C) 2019-today ZEVENET SL, Sevilla (Spain)
  * Licensed under the terms of the GNU Affero General Public License.
  * See License.txt in the project root for license information.
**/

import { APP_BASE_HREF } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { ZevenetInterceptor } from './@core/zevenet/services/zevenet.interceptor';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ThemeModule } from './@theme/theme.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AlertService } from './@core/zevenet/services/zevenet-alert.service';
import { UpdateForceToastComponent } from './@core/zevenet/components/toast/update-force-toast.component';
import { FarmRestartToastComponent } from './@core/zevenet/components/toast/farm-restart-toast.component';
import { CookieService } from 'ngx-cookie-service';
import { MmcBreadcrumbsModule } from 'mmc-breadcrumbs';
import { ToasterModule } from 'angular2-toaster';
import { ZevenetAuthModule } from './@core/zevenet/auth/zevenet-auth.module';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {BrowserModule} from '@angular/platform-browser';
import { NgChartjsModule } from 'ng-chartjs';



@NgModule({
  declarations: [AppComponent, UpdateForceToastComponent, FarmRestartToastComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,

    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    ZevenetAuthModule.forRoot(),
    ToasterModule.forRoot(),
    NgChartjsModule.registerPlugin(),
    MmcBreadcrumbsModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
      },
  }),
  ],
  entryComponents: [
    UpdateForceToastComponent,
    FarmRestartToastComponent,
  ],
  bootstrap: [AppComponent],
  providers: [
    CookieService,
    { provide: APP_BASE_HREF, useValue: '/' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ZevenetInterceptor,
      multi: true,
      deps: [Router, AlertService, CookieService],
    },
  ],
})


export class AppModule {
}


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


