import {environment} from '../environments/environment';

export const api_key = environment.apiKey;

export const apiBaseUrl       = environment.apiBaseUrl;

export const newUserUrl       = apiBaseUrl + '/user';
export const carUrl           = apiBaseUrl + '/cars';
export const timeslotUrl      = apiBaseUrl + '/timeSlots';
export const preSurveyUrl     = apiBaseUrl + '/preSurvey';
export const scheduleRideUrl  = apiBaseUrl + '/drive';
export const reserveSlotUrl   = apiBaseUrl + '/reserve';
export const releaseSlotUrl   = apiBaseUrl + '/release';
export const getAnalyticsUrl  = apiBaseUrl + '/analytics';

export const lookupUserUrl    = apiBaseUrl + '/getUser';
export const postSurveyUrl    = apiBaseUrl + '/postSurvey';

export const surveySubmitUrl  = apiBaseUrl + '/survey';

export const scheduleUrl      = apiBaseUrl + '/schedule';
export const cancelDriveUrl   = apiBaseUrl + '/cancelDrive';
