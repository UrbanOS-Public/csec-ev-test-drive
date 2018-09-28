const moment = require('moment');
const {BetterSmartExperienceMySQLPool} = require('../utils/BetterSmartExperienceMySQLPool');
const ApiHelpers = require('./ApiHelpers');
const extend = require('extend');

const ALREADY_RESERVED_MESSAGE = "Sorry that time slot has been reserved by someone else, please select another car/time combination.";

class ReserveSlot {
    constructor(pool, moment, ApiHelpers) {
        this.moment = moment;
        this.pool = pool;
        this.ApiHelpers = ApiHelpers;
    }

    handleEvent(event, context, callback) {
        const body = JSON.parse(event.body);
        const carSlotId = body.carSlotId;
        this.reserveSlot(carSlotId)
            // .then((updateResponse) => this.validateResponse(updateResponse))
            // .then(() => this.getUserAndDriveData(email, carSlotId))
            // .then((userAndDriveData) => this.insertDrive(userAndDriveData))
            .then((data) => this.successHandler(callback, data), (error) => this.errorHandler(callback, error))
        ;
    }

    reserveSlot(car_slot_id) {
        return this.pool.doQuery("update time_slot ts, car_slot cs set ts.available_count = ts.available_count - 1, cs.reserved = 1 where ts.id = cs.time_slot_id and ts.available_count >= 1 and cs.reserved = 0 and cs.id = ?", car_slot_id)
    }

    validateResponse(updateResponse) {
        if (updateResponse.changedRows !== 2) {
            return Promise.reject(ALREADY_RESERVED_MESSAGE);
        }
        return {};
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
        if (error !== undefined && error.toString().indexOf(ALREADY_RESERVED_MESSAGE) === 0) {
            return this.ApiHelpers.httpResponse(callback, 409, {errors: error});
        }
        this.ApiHelpers.httpResponse(callback, 500, {errors: 'An error occurred when processing your request.'});
    }
}

exports.ReserveSlot = ReserveSlot;
exports.handler = (event, context, callback) => {
    const handler = new ReserveSlot(new BetterSmartExperienceMySQLPool(), moment, ApiHelpers);
    handler.handleEvent(event, context, callback);
};