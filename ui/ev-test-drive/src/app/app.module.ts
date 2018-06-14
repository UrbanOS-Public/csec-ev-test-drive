import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HomeComponent } from './home/home.component';
import { InfoComponent } from './info/info.component';
import { CheckinWelcomeComponent } from './checkin/checkin-welcome/checkin-welcome.component';
import { RegistrationComponent } from './checkin/registration/registration.component';
import { FormComponent } from './common/form/form.component';
import { TextFieldComponent } from './common/text-field/text-field.component';
import { TextBoxComponent } from './common/text-box/text-box.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    InfoComponent,
    CheckinWelcomeComponent,
    RegistrationComponent,
    FormComponent,
    TextFieldComponent,
    TextBoxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
