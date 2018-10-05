const moment = require('moment');
const {BetterSmartExperienceMySQLPool} = require("../../utils/BetterSmartExperienceMySQLPool");
const ApiHelpers = require('../ApiHelpers');
const {EmailAnalytics} = require('../../EmailAnalytics');

class GetDriveSurveyAnalytics {
    constructor(pool, moment, ApiHelpers) {
        this.moment = moment;
        this.pool = pool;
        this.ApiHelpers = ApiHelpers;
    }

    handleEvent(event, context, callback) {
        console.log("Event Log:", JSON.parse(event.body));
        if (!event.body) {
            return this.ApiHelpers.httpResponse(callback, 404);
        }
        const body = JSON.parse(event.body);
        const pin = body.pin;
        if ("17043215" !== pin) {
            return this.ApiHelpers.httpResponse(callback, 404);
        }
        var analytics = new EmailAnalytics(this.pool, moment, null);
        analytics.getSurveyDataForThisWeek(this.moment().startOf('year').format("YYYY-MM-DD"), this.moment().format("YYYY-MM-DD"))
        .then((data) => this.successHandler(callback, this.sanitizeData(data)), (err) => this.errorHandler(callback, err));
    }

    sanitizeData(data) {
        data.forEach((row) => {
            delete row.first_name;
            delete row.last_name;
            delete row.email;
            delete row.phone;
        });
        return data;
    }

    successHandler(callback, data) {
        this.pool.end();
        console.log(`Done`);
        this.ApiHelpers.httpResponse(callback, 200, data);
    }

    errorHandler(callback, error) {
        console.log(`END`);
        this.pool.end();
        console.log(`ERROR: ${error}`);
        this.ApiHelpers.httpResponse(callback, 500, {error: 'An error occurred when processing your request.'});
    }
}

exports.GetDriveSurveyAnalytics = GetDriveSurveyAnalytics;
exports.handler = (event, context, callback) => {
    const handler = new GetDriveSurveyAnalytics(new BetterSmartExperienceMySQLPool(), moment, ApiHelpers);
    handler.handleEvent(event, context, callback);
};