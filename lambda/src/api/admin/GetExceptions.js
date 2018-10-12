const {BetterSmartExperienceMySQLPool} = require("../../utils/BetterSmartExperienceMySQLPool");
const moment = require('moment');
const ApiHelpers = require('../ApiHelpers');

class GetExceptions {
    constructor(pool, moment, ApiHelpers) {
        this.pool = pool;
        this.moment = moment;
        this.ApiHelpers = ApiHelpers;
    }

    handleEvent(event, context, callback) {
        this.getExceptions()
            .then((data) => this.formatData(data))
            .then((data) => this.successHandler(callback, data), (err) => this.errorHandler(callback, err))
        ;
    }

    formatData(data) {
        data = data.map((exception) => {
            exception.date = moment.utc(exception.date).format('YYYY-MM-DD');
            return exception;
        });
        return Promise.resolve(data);
    }

    getExceptions() {
        return this.pool.doQuery("select * from schedule_exception order by date asc");
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

exports.GetExceptions = GetExceptions;
exports.handler = (event, context, callback) => {
    const handler = new GetExceptions(new BetterSmartExperienceMySQLPool(), moment, ApiHelpers);
    handler.handleEvent(event, context, callback);
};