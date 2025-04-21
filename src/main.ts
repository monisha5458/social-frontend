import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { appConfig } from './app/app.config';

// bootstrapApplication(AppComponent, {
//   providers: [
//     importProvidersFrom(FormsModule) // ✅ Add this
//   ]
// });

bootstrapApplication(AppComponent, appConfig);
