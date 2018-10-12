const {BetterSmartExperienceMySQLPool} = require("../../utils/BetterSmartExperienceMySQLPool");
const moment = require('moment');
const ApiHelpers = require('../ApiHelpers');

class AddException {
    constructor(pool, moment, ApiHelpers) {
        this.pool = pool;
        this.moment = moment;
        this.ApiHelpers = ApiHelpers;
    }

    handleEvent(event, context, callback) {
        const body = JSON.parse(event.body);
        const date = moment(body.date).format();
        const pin = body.pin;

        if ("17043215" !== pin) {
            return this.ApiHelpers.httpResponse(callback, 404);
        }
        
        this.addException(date)
            .then((data) => this.successHandler(callback, data), (err) => this.errorHandler(callback, err))
        ;
    }

    addException(date) {
        const query = `
            insert ignore into schedule_exception (date, start_time, end_time, slot_length_minutes, employees_per_slot) values (?)
        `
        return this.pool.doQuery(query, [[date, "00:00", "23:59", "0", 0]]);
    }

    successHandler(callback, data) {
        this.pool.end();
        console.log('Query Result: ', data);
        console.log(`Done`);
        this.ApiHelpers.httpResponse(callback, 200, {message: "Successfully added a schedule exception"});
    }

    errorHandler(callback, error) {
        this.pool.end();
        console.log(`ERROR: ${error}`);
        if (error.statusCode !== undefined) {
            this.ApiHelpers.httpResponse(callback, error.statusCode, {error: error.error});
        }
        this.ApiHelpers.httpResponse(callback, 500, {error: 'An error occurred when processing your request.'});
    }
}

exports.AddException = AddException;
exports.handler = (event, context, callback) => {
    const handler = new AddException(new BetterSmartExperienceMySQLPool(), moment, ApiHelpers);
    handler.handleEvent(event, context, callback);
};