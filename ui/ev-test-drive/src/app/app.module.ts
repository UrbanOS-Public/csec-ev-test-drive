import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import 'hammerjs';

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
import { SurveyComponent } from './common/survey/survey.component';
import { CarConfirmComponent } from './checkin/car-confirm/car-confirm.component';
import { CheckoutWelcomeComponent } from './checkout/checkout-welcome/checkout-welcome.component';
import { ThankYouComponent } from './checkout/thank-you/thank-you.component';
import { ScheduleComponent } from './admin/schedule/schedule.component';
import { ModalComponent } from './common/directives/modal.component';
import { ModalService } from './common/modal.service';
import { HeaderComponent } from './common/header/header.component';
import { AnalyticsComponent } from './admin/analytics/analytics.component';
import { DriveSummaryComponent } from './admin/analytics/drive-summary/drive-summary.component';
import { VehiclesComponent } from './admin/vehicles/vehicles.component';
import { ZipcodeSummaryComponent } from './admin/analytics/zipcode-summary/zipcode-summary.component';

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
    CarReviewComponent,
    SurveyComponent,
    CarConfirmComponent,
    CheckoutWelcomeComponent,
    ThankYouComponent,
    ScheduleComponent,
    ModalComponent,
    HeaderComponent,
    AnalyticsComponent,
    DriveSummaryComponent,
    VehiclesComponent,
    ZipcodeSummaryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSliderModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule
  ],
  providers: [ModalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
