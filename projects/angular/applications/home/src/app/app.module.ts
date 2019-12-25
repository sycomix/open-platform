import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule } from '@tenlastic/ng-http';

import { CoreModule } from './core/core.module';
import { LayoutComponent } from './shared/components';
import { SharedModule } from './shared/shared.module';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';

export const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LayoutComponent,
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'contact-us',
    component: LayoutComponent,
    loadChildren: () =>
      import('./modules/contact-us/contact-us.module').then(m => m.ContactUsModule),
  },
  {
    path: 'patch-notes',
    component: LayoutComponent,
    loadChildren: () =>
      import('./modules/patch-notes/patch-notes.module').then(m => m.PatchNotesModule),
  },
  {
    path: 'play-now',
    component: LayoutComponent,
    loadChildren: () => import('./modules/play-now/play-now.module').then(m => m.PlayNowModule),
  },
];

@NgModule({
  declarations: [AppComponent],
  entryComponents: [AppComponent],
  imports: [
    CoreModule,
    HttpModule.forRoot(environment),
    MaterialModule,
    SharedModule,
    RouterModule.forRoot(ROUTES),
  ],
  providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
