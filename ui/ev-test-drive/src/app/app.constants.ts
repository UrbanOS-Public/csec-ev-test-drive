import {environment} from '../environments/environment';

export const api_key = 'mpUwFh2LT5fqmnqelGbTa49aOABQWF81aQoezAJa';

export const apiBaseUrl       = environment.apiBaseUrl;

export const newUserUrl       = apiBaseUrl + '/user';
export const carUrl           = apiBaseUrl + '/cars';
export const timeslotUrl      = apiBaseUrl + '/timeSlots';
export const preSurveyUrl     = apiBaseUrl + '/preSurvey';
export const scheduleRideUrl  = apiBaseUrl + '/drive';

export const lookupUserUrl    = apiBaseUrl + '/getUser';
export const postSurveyUrl    = apiBaseUrl + '/postSurvey';

export const surveySubmitUrl  = apiBaseUrl + '/survey';

export const scheduleUrl      = apiBaseUrl + '/schedule';
export const cancelDriveUrl   = apiBaseUrl + '/cancelDrive';
