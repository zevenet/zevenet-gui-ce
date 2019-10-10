import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable, } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import 'rxjs';
import { AlertService } from './zevenet-alert.service';
import { timeout } from 'rxjs/operators';
import { isArray, isObject } from 'util';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';



@Injectable({
providedIn:  'root',
})

export class ZevenetService {

  API_URL  =  '';
  langTranslated: Observable<any>;
  host: string;
  hostname: string;
  tracked: boolean = false;
  langSubject = new BehaviorSubject('');

  constructor(private httpClient: HttpClient,
    private alertService: AlertService,
    public translate: TranslateService,
  ) {
    this.locationHost();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langSubject.next(event.lang);
    });
  }

  changeLang(): Observable<any> {
    return this.langSubject.asObservable();
  }

  /* Translate Language */
  interpolateLang(selectJson: any, param: any): any {
     return new Promise((resolve, reject) => {
      this.translate.get(selectJson, param).subscribe((translated_text) => {
        resolve(translated_text);
      });
    });
  }

  refreshLang(selectJson: string, textLang: any): Observable<any> {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      return this.translateLang(selectJson, textLang);
    });
    return this.translateLang(selectJson, textLang);
  }

  translateLang(selectJson: string, textLang: any): Observable<any> {
    if (isArray(textLang)) {
      this.translate.get(selectJson).subscribe((translated_text) => {
        textLang.forEach(element => {
          const header = element.hasOwnProperty('header') ? 'header' : 'label';
          const lab = element.hasOwnProperty('value') ? 'value' : 'field';
          element[header] = translated_text[element[lab]];
        });
      });
    } else if (isObject(textLang)) {
      if (textLang.hasOwnProperty('backend') && textLang.hasOwnProperty('session') ) {
        this.translate.get(selectJson).subscribe((translated_text) => {
          Object.keys(textLang.backend).forEach(element => {
            textLang.backend[element].forEach(child => {
              child.header = translated_text[child.field];
            });
          });
          Object.keys(textLang.session).forEach(element => {
            textLang.session[element].forEach(child => {
            child.header = translated_text[child.field];
            if (child.field === 'id') {
              child.header = translated_text['backend_id'];
            } else if (child.field === 'session') {
                child.header = translated_text['session_id'];
            } else {
                child.header = translated_text[child.field];
              }
            });
          });
        });
      }
    } else if (typeof textLang === 'string') {
      this.translate.get(selectJson).subscribe((translated_text) => {
        textLang = translated_text;
      });
    }
    this.langTranslated = new Observable((observer) => {
      observer.next(textLang);
      observer.complete();
    });

    return this.langTranslated;
  }

  /* Locations */

  locationHost(): void {
    this.host = location.host;
    this.updateApiUrl();
  }

  updateApiUrl(): void {
    this.API_URL = 'https://' + this.host + '/zapi/v4.0/zapi.cgi';
  }

  /* Common functions */

  delete(object: string, name: string): Observable<any> {
    return this.httpClient.delete(`${this.API_URL}/${object}/${name}`);
  }

  getList(object: string): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/${object}`);
  }

  getObject(path: string, object: string): Observable<any> {
    let type = 'json';
    if (object === 'html' || object === 'supportsave')
      type = 'text';
    const params = {responseType: type as 'text'};
    if (object === 'supportsave')
      params['observe'] = 'response';
    return this.httpClient.get(`${this.API_URL}/${path}/${object}`, params);
  }

  getSubobject(object: string, suboject: string, nameObject: string, nameSubobject): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/${object}/${nameObject}/${suboject}/${nameSubobject}`);
  }

  download(type: string, name: string): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/${type}/${name}`, {responseType: 'text'});
  }

  upload(object: string, name: string, file: any): Observable<any> {
    if (object === 'certificates')
      return this.httpClient.post(`${this.API_URL}/${object}/${name}`, file);
    return this.httpClient.put(`${this.API_URL}/${object}/${name}`, file);
  }

  post(object: string, params): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/${object}`, params);
  }

  update(object: string, name: string, params): Observable<any> {
    return this.httpClient.put(`${this.API_URL}/${object}/${name}`, params);
  }

  /* Farms */
  getFarms(): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/farms`);
  }

  getFarmsModule(module: string): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/farms/modules/${module}`);
  }

  getFarm(name: string): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/farms/${name}`);
  }

  applyCert(nameFarm: string, cert: string): Observable<any> {
    const param = {file: cert};
    return this.httpClient.post(`${this.API_URL}/farms/${nameFarm}/certificates`, param);
  }

  actionFarm(nameFarm: string, actionType: string): Observable<any> {
    const param = {action: actionType};
    return this.httpClient.put(`${this.API_URL}/farms/${nameFarm}/actions`, param);
  }

  getService(nameFarm: string, nameService: string): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/farms/${nameFarm}/services/${nameService}`);
  }

  deleteBackend(nameFarm: string,  backend: any, nameService?: string): Observable<any> {
    let url = `backends/${backend}`;
    if (nameService) {
      url = `services/${nameService}/backends/${backend}`;
    }

    return this.httpClient.delete(`${this.API_URL}/farms/${nameFarm}/${url}`);
  }

  actionBackend(nameFarm: string, backend: any, action: string, mode: string, nameService?: string): Observable<any> {
    let url = `backends/${backend}/maintenance`;
    if (nameService) {
      url = `services/${nameService}/backends/${backend}/maintenance`;
    }
    const param = {action: action};
    if (action === 'maintenance') param['mode'] = mode;
    return this.httpClient.put(`${this.API_URL}/farms/${nameFarm}/${url}`, param);
  }

  /*Network*/

  actionNetwork(name: string, type: string, action): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/interfaces/${type}/${name}/actions`, action);
  }

  /* Stats */

  getStats(object?: string): Observable<any> {
    let path = 'stats';
    if (object)
       path += '/' + object;
    return this.httpClient.get(`${this.API_URL}/${path}`);
  }

  getInfo(): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/system/version`);
  }

  /* News */

  getNews(hostname, version): Observable<any> {
    const actionUrl = 'https://www.zevenet.com/json/ce5.9/ceinfo.php?host=' + hostname + '&version=' + version;

    return this.httpClient.get(actionUrl).pipe(timeout(15000));
  }

  /* Notifications */

  showToast(type: string, title: string, body: string) {
    this.alertService.showToast(type, title, body);
  }

  clearToast(id?) {
    this.alertService.clearToast(id);
  }

  alertRestart(toast) {
    this.alertService.alertRestart(toast);
  }

  alertForce(toast) {
    this.alertService.alertForce(toast);
  }

  /* Searchs functions */

  searchFarmguardian(term: string, item: any) {
    term = term.toLocaleLowerCase();
    let result;
    if (item.name) {
      result = item.name.toLocaleLowerCase().indexOf(term) > -1;
    }
    if (item.description) {
      result = result || item.description.toLocaleLowerCase().indexOf(term) > -1;
    }

    return result;
  }

  searchInterface(term: string, item: any) {
    term = term.toLocaleLowerCase();
    let result;
    if (item.ip) {
      result = item.ip.toLocaleLowerCase().indexOf(term) > -1;
    }
    if (item.name) {
      result = result || item.name.toLocaleLowerCase().indexOf(term) > -1;
    }
    if (item.type) {
      result = result || item.type.toLocaleLowerCase() === term;
    }

    return result;
  }

  /* Download file */

  downloadFile(data, nameFile, type): void {
    const blob = new Blob([data], {type: type});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('style', 'display: none');
    document.body.appendChild(a);
    a.href = url;
    a.download = nameFile;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

}
