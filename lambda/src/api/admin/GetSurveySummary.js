const {BetterSmartExperienceMySQLPool} = require("../../utils/BetterSmartExperienceMySQLPool");
const moment = require('moment');
const ApiHelpers = require('../ApiHelpers');

class GetSurveySummary {
    constructor(pool, moment, ApiHelpers) {
        this.pool = pool;
        this.moment = moment;
        this.ApiHelpers = ApiHelpers;
    }

    handleEvent(event, context, callback) {
        this.getSurveyCounts()
            .then((data) => this.formatData(data))
            .then((data) => this.successHandler(callback, data), (err) => this.errorHandler(callback, err))
        ;
    }

    formatData(data) {  //Todo
        return Promise.resolve(data);
    }

    getSurveyCounts() {
        let query = `select confirmation_number from user_response where survey_id = '1000001'`

        return this.pool.doQuery(query);
    }


    successHandler(callback, data) {
        this.pool.end();
        console.log(`Done`);
        this.ApiHelpers.httpResponse(callback, 200, data);
    }

    errorHandler(callback, error) {
        this.pool.end();
        console.log(`ERROR: ${error}`);
        this.ApiHelpers.httpResponse(callback, 500, {error: 'An error occurred when processing your request.'});
    }
}

exports.GetSurveySummary = GetSurveySummary;
exports.handler = (event, context, callback) => {
    const handler = new GetSurveySummary(new BetterSmartExperienceMySQLPool(), moment, ApiHelpers);
    handler.handleEvent(event, context, callback);
};