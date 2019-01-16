import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ZevenetAuthRoutingModule } from './zevenet-auth-routing.module';
import { ZevenetLoginComponent } from './login/login.component';
import {
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbInputModule,
} from '@nebular/theme';
import { ThemeModule } from '../../../@theme/theme.module';
import { NbAuthModule, NbPasswordAuthStrategy } from '@nebular/auth';
import { ZevenetAuthService } from './zevenet-auth.service';


export const NB_CORE_PROVIDERS = [

  ...NbAuthModule.forRoot({

    strategies: [
      NbPasswordAuthStrategy.setup({
        name: 'email',
        baseEndpoint: '/zapi/v4.0/zapi.cgi',
        login: {
          endpoint: '/session',
          method: 'post',
          redirect: {
              success: '/pages/dashboard',
              failure: null,
          },
          defaultErrors: [],
        },
        logout: {
          endpoint: '/session',
          method: 'delete',
          redirect: {
              success: '/auth/login',
              failure: null,
          },
        },
        token: {
          key: 'user',
        },
      }),
    ],
    forms: {
      logout: {
        strategy: 'email',
      },
    },
  }).providers,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NbAuthModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    ZevenetAuthRoutingModule,
    ThemeModule,
  ],
  declarations: [
    ZevenetLoginComponent,
  ],
  providers: [
    ZevenetAuthService,
  ],
})
export class ZevenetAuthModule {

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: ZevenetAuthModule,
      providers: [
        ...NB_CORE_PROVIDERS,
      ],
    };
  }
}
