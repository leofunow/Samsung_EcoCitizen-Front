import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideNzIcons } from './icons-provider';
import { ru_RU, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import ru from '@angular/common/locales/ru';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { AngularYandexMapsModule, YaConfig } from 'angular8-yandex-maps';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

registerLocaleData(ru);

const mapConfig: YaConfig = {
  apikey: '81dcd694-7601-4387-bd05-996e3e78db3d',
  lang: 'ru_RU',
};


export const appConfig: ApplicationConfig = {
  providers: [provideCharts(withDefaultRegisterables()), importProvidersFrom(AngularYandexMapsModule.forRoot(mapConfig)), provideRouter(routes), provideNzIcons(), provideNzI18n(ru_RU), importProvidersFrom(FormsModule), provideAnimationsAsync(), provideHttpClient()]
};
