const moment = require('moment');
const {BetterSmartExperienceMySQLPool} = require('./utils/BetterSmartExperienceMySQLPool');
const dateUtils = require('./utils/DateUtils');
const AWS = require('aws-sdk');
const ses = new AWS.SES();
const {EmailAnalytics} = require('./EmailAnalytics');

exports.handler = (event, context, callback) => {

    const today = moment(dateUtils.todayInESTFormatted()).format("YYYY-MM-DD");
    const oneWeekAgo = moment(today).subtract(7, "days").format("YYYY-MM-DD");
    const yesterday = moment(today).subtract(1, "days").format("YYYY-MM-DD");


    new EmailAnalytics(new BetterSmartExperienceMySQLPool(), moment, ses)
        .handleEvent(event, context, callback, today, oneWeekAgo, yesterday)
    ;
};