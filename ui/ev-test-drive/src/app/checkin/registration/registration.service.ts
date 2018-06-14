import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as globals from '../../app.constants';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'x-api-key': globals.api_key
  })
};

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private http: HttpClient) { }

  postNewUser(data) {
    return this.http.post(
      globals.newUserUrl,
      data,
      httpOptions);

    
  } 
}
