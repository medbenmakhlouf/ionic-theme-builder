import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { AnalyticsService } from './core/services/analytics.service';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideIonicAngular(),
    provideAppInitializer(() => {
      const analytics = inject(AnalyticsService);
      analytics.init();
    }),
    provideClientHydration(withEventReplay()),
  ],
};
