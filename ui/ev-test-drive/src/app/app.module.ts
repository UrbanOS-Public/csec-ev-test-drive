import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { AppRoutingModule }     from './app-routing.module';
import { NotAloneComponent } from './info/not-alone/not-alone.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotAloneComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
