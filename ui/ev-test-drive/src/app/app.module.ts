import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule, MatDatepickerModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';


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
import { GenderSummaryComponent } from './admin/analytics/gender-summary/gender-summary.component';
import { DaySummaryComponent } from './admin/analytics/day-summary/day-summary.component';
import { ExceptionsComponent } from './admin/exceptions/exceptions.component';
import { ListComponent } from './admin/exceptions/list/list.component';
import { ExceptionFormComponent } from './admin/exceptions/exception-form/exception-form.component';
import { NavbarComponent } from './admin/navbar/navbar.component';
import { AdhocReservationComponent } from './admin/schedule/adhoc-reservation/adhoc-reservation.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { EditReservationComponent } from './admin/schedule/edit-reservation/edit-reservation.component';
import { AppRawDataComponent } from './admin/analytics/app-raw-data/app-raw-data.component';
import { SurveySummaryComponent } from './admin/analytics/survey-summary/survey-summary.component';

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
    ZipcodeSummaryComponent,
    GenderSummaryComponent,
    DaySummaryComponent,
    ExceptionsComponent,
    ListComponent,
    ExceptionFormComponent,
    NavbarComponent,
    AdhocReservationComponent,
    EditReservationComponent,
    AppRawDataComponent,
    SurveySummaryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSliderModule,
    MatCardModule,
    MatSelectModule,
    MatTableModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatMomentDateModule,
    MatInputModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    NgxMaterialTimepickerModule.forRoot()
  ],
  providers: [ModalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
