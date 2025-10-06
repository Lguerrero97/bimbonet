import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {provideTranslateHttpLoader} from "@ngx-translate/http-loader";
import { provideTranslateService, TranslateModule } from '@ngx-translate/core';
import {  provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
  provideClientHydration(),
  provideAnimations(),
  provideHttpClient(),
  provideTranslateService({
     loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json'
      }),
    fallbackLang: 'es',
    lang: 'es'
  })
  ]
};
