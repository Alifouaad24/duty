import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations'; // ضروري لتشغيل التوستر
import { routes } from './app.routes';
import { provideToastr } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    provideAnimations(), // required animations providers
    provideToastr({
      closeButton: true,
      progressBar: true,
      timeOut: 2000
    }),
  ]
  
};
