import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { EventService } from './shared/event.service';
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './token-interceptor.service';

import { CurrencyPipe } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';

import { UserService } from './services/user.service';
import { OrganisationService } from './services/organisation.service';
import { IdeaService } from './services/idea.service';
import { StartupPageComponent } from './startup-page/startup-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { DetailsPageComponent } from './details-page/details-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/startup-page', pathMatch: 'full' },
  {
    path: 'startup-page',
    component:StartupPageComponent
  },
  {
    path: 'org',
    loadChildren: () => import('./_organisation/organisation/organisation.module').then(m => m.OrganizationModule)
  },
  {
    path: 'organisation',
    loadChildren: () => import('./organisation/organisationmain.module').then(m => m.OrganisationMainModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'account',
    loadChildren: () => import('./_account/account/account.module').then(m => m.AccountModule)
  },
];

@NgModule({
  declarations: [
    AppComponent,
    // DetailsPageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    HttpClientModule
  ],
  providers: [
    OrganisationService,
    UserService,
    IdeaService,
    AuthGuard,
    CurrencyPipe,
    EventService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
