import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HomeComponent } from './home/home.component';
import { InfoComponent } from './info/info.component';
import { CheckinWelcomeComponent } from './checkin/checkin-welcome/checkin-welcome.component';
import { RegistrationComponent } from './checkin/registration/registration.component';
import { FormComponent } from './common/form/form.component';
import { TextFieldComponent } from './common/text-field/text-field.component';
import { TextBoxComponent } from './common/text-box/text-box.component';
import { CarSelectionComponent } from './checkin/car-selection/car-selection.component';
import { CarTileComponent } from './common/car-tile/car-tile.component';
import { SpinnerComponent } from './common/spinner/spinner.component';
import { CarReviewComponent } from './checkin/car-review/car-review.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    InfoComponent,
    CheckinWelcomeComponent,
    RegistrationComponent,
    FormComponent,
    TextFieldComponent,
    TextBoxComponent,
    CarSelectionComponent,
    CarTileComponent,
    SpinnerComponent,
    CarReviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
