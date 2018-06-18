import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { InfoComponent } from './info/info.component';

import { CheckinWelcomeComponent } from './checkin/checkin-welcome/checkin-welcome.component';
import { RegistrationComponent } from './checkin/registration/registration.component';
import { CarSelectionComponent } from './checkin/car-selection/car-selection.component';
import { CarReviewComponent } from './checkin/car-review/car-review.component'; 
import { SurveyComponent } from './common/survey/survey.component';

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
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];
 
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
