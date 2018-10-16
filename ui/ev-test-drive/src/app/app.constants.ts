import {environment} from '../environments/environment';

export const api_key = environment.apiKey;

export const optInQuestion = "POST - Registration for this event may be used by participating automotive manufacturers to learn about your experience and communicate with you. Would you like a local dealership or participating automotive manufacturer to contact you with more information?";
export const optInAnswer = 'Yes, and I give you permission to share my contact information for this purpose';

export const apiBaseUrl       = environment.apiBaseUrl;

export const newUserUrl       = apiBaseUrl + '/user';
export const carUrl           = apiBaseUrl + '/cars';
export const exceptionsUrl    = apiBaseUrl + '/exceptions';
export const addExceptionUrl  = apiBaseUrl + '/addException';
export const deleteExceptionUrl  = apiBaseUrl + '/deleteException';
export const timeslotUrl      = apiBaseUrl + '/timeSlots';
export const preSurveyUrl     = apiBaseUrl + '/preSurvey';
export const scheduleRideUrl  = apiBaseUrl + '/drive';
export const scheduleAdhocRideUrl  = apiBaseUrl + '/adhocDrive';
export const reserveSlotUrl   = apiBaseUrl + '/reserve';
export const releaseSlotUrl   = apiBaseUrl + '/release';
export const getAnalyticsUrl  = apiBaseUrl + '/analytics';
export const patchCarState    = apiBaseUrl + '/carState';

export const lookupUserUrl    = apiBaseUrl + '/getUser';
export const postSurveyUrl    = apiBaseUrl + '/postSurvey';

export const surveySubmitUrl  = apiBaseUrl + '/survey';

export const scheduleUrl      = apiBaseUrl + '/schedule';
export const cancelDriveUrl   = apiBaseUrl + '/cancelDrive';

export const adminNavbar = [
    {icon:'insert_chart_outlined',route:'/admin/analytics'},
    {icon:'directions_car',route:'/admin/vehicles'},
    {icon:'perm_contact_calendar',route:'/admin/schedule'},
    {icon:'schedule',route:'/admin/exceptions'}
]
