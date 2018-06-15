const moment = require('moment');
const smartExperienceMySQLPool = require('../utils/SmartExperienceMySQLPool');
const ApiHelpers = require('./ApiHelpers');
const {GetSurvey} = require('./GetSurvey');

exports.handler = (event, context, callback) => {
    const handler = new GetSurvey(smartExperienceMySQLPool.newPool(), moment, ApiHelpers, 'PRE');
    handler.handleEvent(event, context, callback);
};