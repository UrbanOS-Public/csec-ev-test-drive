import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as globals from '../app.constants';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

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

  postAddException(data) {
    return this.http.post(
      globals.addExceptionUrl,
      data,
      httpOptions);
  }

  postDeleteException(data) {
    return this.http.post(
      globals.deleteExceptionUrl,
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

  postScheduleAdhocDrive(data) {
    return this.http.post(
      globals.scheduleAdhocRideUrl,
      data,
      httpOptions);
  }

  postReserveSlot(data) {
    return this.http.post(
      globals.reserveSlotUrl,
      data,
      httpOptions);
  }

  postReleaseSlot(data) {
    return this.http.post(
      globals.releaseSlotUrl,
      data,
      httpOptions);
  }

  postCarState(data) {
    return this.http.post(
      globals.patchCarState,
      data,
      httpOptions);
  }

  getCars() {
    return this.http.get(globals.carUrl, httpOptions);
  }

  getExceptions() {
    return this.http.get(globals.exceptionsUrl, httpOptions)
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

  getAnalytics(pin) {
    if (environment.useLocalAPI) {
      return this.http.get(globals.getAnalyticsUrl, httpOptions);
    } else {
      return this.http.post(globals.getAnalyticsUrl, {pin:pin}, httpOptions);
    }
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

  getSchedule(date = null) {
    let lookupOptions = httpOptions;

    if (date) {
      let params: any = {};
      params.date = date;

      lookupOptions['params'] = params;
    }

    return this.http.get(globals.scheduleUrl, lookupOptions);
  }

  cancelRide(confirmationNumber, pin) {
    const params = {
      pin: pin,
      confirmationNumber: confirmationNumber
    };

    return this.http.post(globals.cancelDriveUrl, params, httpOptions);
  }
}
