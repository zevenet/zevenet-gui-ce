/**
  * @license
  * Zevenet Software License
  * This file is part of the Zevenet Load Balancer software.
  *
  * Copyright (C) 2019-today ZEVENET SL, Sevilla (Spain)
  * Licensed under the terms of the GNU Affero General Public License.
  * See License.txt in the project root for license information.
**/

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable,  of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AlertService } from './zevenet-alert.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class ZevenetInterceptor implements HttpInterceptor {

  constructor(private router: Router,
    private alertServ: AlertService,
    private cookieService: CookieService,
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const content_type = request.method === 'PUT' && request.url.includes('system/backup') ?
      'application/gzip' :
        request.url.includes('system/license') ?
          'text/plain' : request.url.includes('certificates/') && request.method === 'POST' ?
            'application/x-pem-file' : 'application/json';

    let clonedRequest;
    if (request.url.includes('session') && (request.method === 'POST' || request.method === 'OPTIONS')) {
      clonedRequest = request.clone({
        headers: new HttpHeaders({
          'Authorization': 'Basic ' + btoa(request.body.email + ':' + request.body.password),
          'Content-Type':  content_type,
        }),
        withCredentials: true,
        body: {},
      });
    } else if (request.url.includes('ceinfo.php')) {
      clonedRequest = request.clone();
    } else {
      clonedRequest = request.clone({
        headers: new HttpHeaders({
          'Content-Type':  content_type,
        }),
        withCredentials: true,
      });
    }

    return next.handle(clonedRequest)
    .pipe(
      map((data: any) => {
        return data;
      }),
      catchError((error: any, caught: Observable<HttpEvent<any>>) => {
        if (error.url.includes('zapi.cgi/session')) {
          this.handleLoginError(error);
        } else if (error.url.includes('ceinfo.php')) {
          throw error.error;
        } else {
          this.handleAuthError(error);
        }
        return of(error);
      }) as any);
   }

   private handleAuthError(err: HttpErrorResponse): Observable<any> {
    if (err.status === 401) {
      this.cookieService.delete('CGISESSID');
      this.router.navigate(['auth/login']);
    } else if (err.status === 400) {
      if (err.error.message.includes('parameter \'force\'')) {
        err.error.force = 'true';
      } else {
        this.alertServ.showToast('error', '', err.error.message);
      }
    } else if (err.status === 500) {
      this.alertServ.showToast('error', '', 'An error has occurred on the server, try again later');
    } else if (err.status === 0) {
      this.alertServ.showToast('error', '', 'Connection to web server failed');
    } else {
      this.alertServ.showToast('error', '', 'An unexpected error has occurred');
    }
    throw err.error;
  }

  private handleLoginError(err: HttpErrorResponse): Observable<any> {
    if (err.status === 401) {
      this.alertServ.showToast('error', '', err.error.message);
    }
    throw err;
  }
}
