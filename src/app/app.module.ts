import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastComponent } from './shared/toast/toast.component';
import { HomeComponent } from './home/home.component'; 

@NgModule({
  declarations: [
    // Leave this empty! Standalone components do not get declared here.
  
    HomeComponent,
    ToastComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AppComponent,    // Move AppComponent here because it is Standalone
    ToastComponent   // ToastComponent stays here because it is Standalone
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }