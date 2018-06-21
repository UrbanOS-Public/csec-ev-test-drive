import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { InfoComponent } from './info/info.component';

import { CheckinWelcomeComponent } from './checkin/checkin-welcome/checkin-welcome.component';
import { RegistrationComponent } from './checkin/registration/registration.component';
import { CarSelectionComponent } from './checkin/car-selection/car-selection.component';
import { CarReviewComponent } from './checkin/car-review/car-review.component'; 
import { CarConfirmComponent } from './checkin/car-confirm/car-confirm.component';

import { CheckoutWelcomeComponent } from './checkout/checkout-welcome/checkout-welcome.component';
import { ThankYouComponent } from './checkout/thank-you/thank-you.component';

import { SurveyComponent } from './common/survey/survey.component';

import { ScheduleComponent } from './admin/schedule/schedule.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'info/:pageId', component: InfoComponent },
  { path: 'checkin', component: CheckinWelcomeComponent },
  { path: 'checkin/registration', component: RegistrationComponent },
  { path: 'checkin/carSelection', component: CarSelectionComponent },
  { path: 'checkin/carReview', component: CarReviewComponent },
  { path: 'checkin/survey', component: SurveyComponent },
  { path: 'checkin/survey/:questionId', component: SurveyComponent },
  { path: 'checkin/carConfirm', component: CarConfirmComponent },
  { path: 'checkout', component: CheckoutWelcomeComponent },
  { path: 'checkout/survey', component: SurveyComponent },
  { path: 'checkout/survey/:questionId', component: SurveyComponent },
  { path: 'checkout/thankYou', component: ThankYouComponent },
  { path: 'admin/schedule', component: ScheduleComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];
 
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
