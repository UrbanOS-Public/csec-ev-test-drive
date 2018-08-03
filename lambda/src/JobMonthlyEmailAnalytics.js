const moment = require('moment');
const {BetterSmartExperienceMySQLPool} = require('./utils/BetterSmartExperienceMySQLPool');
const dateUtils = require('./utils/DateUtils');
const AWS = require('aws-sdk');
const ses = new AWS.SES();
const {EmailAnalytics} = require('./EmailAnalytics');

exports.handler = (event, context, callback) => {

    const today = moment(dateUtils.todayInESTFormatted()).format("YYYY-MM-DD");
    const start = moment(today).startOf('year').format("YYYY-MM-DD");
    const end = moment(today).subtract(1, "days").format("YYYY-MM-DD");

    new EmailAnalytics(new BetterSmartExperienceMySQLPool(), moment, ses)
        .handleEvent(event, context, callback, today, start, end)
    ;
};