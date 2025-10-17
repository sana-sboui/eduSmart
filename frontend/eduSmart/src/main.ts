import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { registerIcons } from './app/icons.config';
import { authInterceptor } from './app/interceptors/auth-interceptor';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
registerIcons(); 
defineCustomElements(window);
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])), 
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({
      mode: 'ios', 
    }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
