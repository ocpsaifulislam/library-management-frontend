import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastComponent } from './shared/toast/toast.component';

@NgModule({
  declarations: [ToastComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AppComponent,
    ToastComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
