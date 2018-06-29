const {BetterSmartExperienceMySQLPool} = require("../../utils/BetterSmartExperienceMySQLPool");
const moment = require('moment');
const ApiHelpers = require('../ApiHelpers');

class GetSchedule {
    constructor(pool, moment, ApiHelpers) {
        this.pool = pool;
        this.moment = moment;
        this.ApiHelpers = ApiHelpers;
    }

    handleEvent(event, context, callback) {
        this.getSchedules()
            .then((data) => this.successHandler(callback, data), (err) => this.errorHandler(callback, err))
        ;
    }

    getSchedules() {
        return this.pool.doQuery("select * from schedule order by day_of_the_week asc");
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

exports.GetSchedule = GetSchedule;
exports.handler = (event, context, callback) => {
    const handler = new GetSchedule(new BetterSmartExperienceMySQLPool(), moment, ApiHelpers);
    handler.handleEvent(event, context, callback);
};