import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as globals from '../app.constants';
import { Observable, of } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'x-api-key': globals.api_key
  })
};

@Injectable({
  providedIn: 'root'
})
export class EVService {

  constructor(private http: HttpClient) { }

  postNewUser(data) {
    return this.http.post(
      globals.newUserUrl,
      data,
      httpOptions);
  }

  postSurvey(data) {
    return this.http.post(
      globals.surveySubmitUrl,
      data,
      httpOptions);
  }

  postScheduleDrive(data) {
    return this.http.post(
      globals.scheduleRideUrl,
      data,
      httpOptions);
  }

  getCars() {
    return this.http.get(globals.carUrl, httpOptions);
  }

  getTimeslots() {
    return this.http.get(globals.timeslotUrl, httpOptions);
  }

  getPreSurvey() {
    return this.http.get(globals.preSurveyUrl, httpOptions);
  }

  getPostSurvey() {
    return this.http.get(globals.postSurveyUrl, httpOptions);
  }

  lookupUser(submitData) {
    let lookupOptions = httpOptions;
    let params: any = {};

    if (submitData.email) {
      params.email = submitData.email;
    } else {
      params.confirmationNumber = submitData.confirmationNumber;
    }

    lookupOptions['params'] = params;

    return this.http.get(globals.lookupUserUrl, lookupOptions);
  }
}
