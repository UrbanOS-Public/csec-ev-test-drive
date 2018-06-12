import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Home Page 
import { HomeComponent }   from './home/home.component';

// Info (QR Code) Pages
import { InfoComponent } from './info/info.component';
 
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'info/:pageId', component: InfoComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];
 
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
