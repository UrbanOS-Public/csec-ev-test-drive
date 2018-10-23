const moment = require('moment');
const {BetterSmartExperienceMySQLPool} = require('../../utils/BetterSmartExperienceMySQLPool');
const ApiHelpers = require('../ApiHelpers');
const extend = require('extend');
const JobMonthlyEmailAnalytics = require('../../JobMonthlyEmailAnalytics');

class SendAnalyticsEmail { //Should be a patch in terraform/AWS. We had issues with non post/get api gateway endpoints. This is set up as a post as a workaround
    constructor(pool, moment, ApiHelpers) {
        this.moment = moment;
        this.pool = pool;
        this.ApiHelpers = ApiHelpers;
    }

    handleEvent(event, context, callback) {
        const body = JSON.parse(event.body);
        const pin = body.pin;
        
        if ("***REMOVED***" !== pin) {
            return this.ApiHelpers.httpResponse(callback, 404);
        }
        JobMonthlyEmailAnalytics.handler(event, context, callback);
    }


    successHandler(callback, data) {
        this.pool.end();
        console.log(`Done`);
        const response = extend({message: "Success"}, data);
        this.ApiHelpers.httpResponse(callback, 200, response);
    }

    errorHandler(callback, error) {
        this.pool.end();
        console.log(`ERROR: ${error}`);
        this.ApiHelpers.httpResponse(callback, 500, {errors: 'An error occurred when processing your request.'});
    }
}

exports.SendAnalyticsEmail = SendAnalyticsEmail;
exports.handler = (event, context, callback) => {
    const handler = new SendAnalyticsEmail(new BetterSmartExperienceMySQLPool(), moment, ApiHelpers);
    handler.handleEvent(event, context, callback);
};