const moment = require('moment');
const {BetterSmartExperienceMySQLPool} = require('../utils/BetterSmartExperienceMySQLPool');
const ApiHelpers = require('./ApiHelpers');
const {GetSurvey} = require('./GetSurvey');

exports.handler = (event, context, callback) => {
    const handler = new GetSurvey(new BetterSmartExperienceMySQLPool(), moment, ApiHelpers, 'POST');
    handler.handleEvent(event, context, callback);
};