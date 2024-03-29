const moment = require('moment');
const {BetterSmartExperienceMySQLPool} = require('../utils/BetterSmartExperienceMySQLPool');
const ApiHelpers = require('./ApiHelpers');
const extend = require('extend');

class ReleaseSlot {
    constructor(pool, moment, ApiHelpers) {
        this.moment = moment;
        this.pool = pool;
        this.ApiHelpers = ApiHelpers;
    }

    handleEvent(event, context, callback) {
        const body = JSON.parse(event.body);
        const carSlotId = body.carSlotId;
        this.releaseSlot(carSlotId)
            .then((data) => this.successHandler(callback, data), (error) => this.errorHandler(callback, error))
        ;
    }

    releaseSlot(car_slot_id) {
        return this.pool.doQuery("update time_slot ts, car_slot cs set ts.available_count = ts.available_count + 1, cs.reserved = 0, cs.reserved_by = null where ts.id = cs.time_slot_id and cs.id = ?", [car_slot_id])
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

exports.ReleaseSlot = ReleaseSlot;
exports.handler = (event, context, callback) => {
    const handler = new ReleaseSlot(new BetterSmartExperienceMySQLPool(), moment, ApiHelpers);
    handler.handleEvent(event, context, callback);
};