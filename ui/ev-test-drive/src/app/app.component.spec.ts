import { TestBed, async } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';

import { AppComponent } from './app.component';
import { AppRoutingModule }     from './app-routing.module';

import { FormComponent } from './common/form/form.component';
import { TextBoxComponent } from './common/text-box/text-box.component';
import { TextFieldComponent } from './common/text-field/text-field.component';

import { HomeComponent } from './home/home.component';

import { InfoComponent } from './info/info.component';

import { CheckinWelcomeComponent } from './checkin/checkin-welcome/checkin-welcome.component';
import { RegistrationComponent } from './checkin/registration/registration.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        FormComponent,
        TextBoxComponent,
        TextFieldComponent,
        HomeComponent,
        InfoComponent,
        CheckinWelcomeComponent,
        RegistrationComponent
      ],
      imports: [
        AppRoutingModule
      ],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/'}
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'EV Test Drive Application'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('EV Test Drive Application');
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
  }));
});
