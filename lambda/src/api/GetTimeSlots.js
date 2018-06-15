const moment = require('moment');
const smartExperienceMySQLPool = require('../utils/SmartExperienceMySQLPool');
const ApiHelpers = require('./ApiHelpers');

class GetTimeSlots {
    constructor(pool, moment, ApiHelpers) {
        this.moment = moment;
        this.pool = pool;
        this.ApiHelpers = ApiHelpers;
    }

    handleEvent(event, context, callback) {
        const today = this.moment().format("YYYY-MM-DD");
        const timeSlotsPromise = this.getTimeSlotsForDate(today);
        const carSlotsPromise = this.getCarSlotsForDate(today);

        Promise.all([timeSlotsPromise, carSlotsPromise])
            .then((promiseResults) => this.transformData(promiseResults))
            .then((transformedData) => this.successHandler(callback, transformedData), (error) => this.errorHandler(callback, error))
        ;
    }

    getTimeSlotsForDate(date) {
        return this.doQuery("select * from time_slot where date = ?", date);
    }

    getCarSlotsForDate(date) {
        return this.doQuery("select cs.* from car_slot cs, time_slot ts where cs.time_slot_id = ts.id and ts.date = ?", date);
    }

    doQuery(query, params) {
        return new Promise((resolve, reject) => {
            this.pool.query(query, params, function (error, results) {
                if (error) {
                    return reject(error);
                } else {
                    return resolve(results);
                }
            });
        });
    }

    transformData(promiseResults) {
        const timeSlots = promiseResults[0];
        const carSlots = promiseResults[1];
        var results = [];
        timeSlots.forEach((timeSlot) => {

            const carSlotsForThisTimeSlot = carSlots.filter((carSlot) => {
                return carSlot.time_slot_id === timeSlot.id;
            }).map((carSlot) => {
                return {
                    carSlotId: carSlot.id,
                    carId: carSlot.car_id,
                    reserved: carSlot.reserved !== 0
                }
            });
            const object = {
                date: moment(timeSlot.date).format("YYYY-MM-DD"),
                startTime: timeSlot.start_time,
                endTime: timeSlot.end_time,
                availableCount: timeSlot.available_count,
                cars: carSlotsForThisTimeSlot
            };
            results.push(object);
        });
        return results;
    }

    successHandler(callback, data) {
        smartExperienceMySQLPool.closePool(this.pool);
        console.log(`Done`);
        this.ApiHelpers.httpResponse(callback, 200, data);
    }

    errorHandler(callback, error) {
        smartExperienceMySQLPool.closePool(this.pool);
        console.log(`ERROR: ${error}`);
        this.ApiHelpers.httpResponse(callback, 500, {error: 'An error occurred when processing your request.'});
    }
}

exports.GetTimeSlots = GetTimeSlots;
exports.handler = (event, context, callback) => {
    const handler = new GetTimeSlots(smartExperienceMySQLPool.newPool(), moment, ApiHelpers);
    handler.handleEvent(event, context, callback);
};