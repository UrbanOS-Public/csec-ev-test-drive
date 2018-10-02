const moment = require('moment');
const {BetterSmartExperienceMySQLPool} = require('../utils/BetterSmartExperienceMySQLPool');
const ApiHelpers = require('./ApiHelpers');
const dateUtils = require('../utils/DateUtils');

class GetTimeSlots {
    constructor(pool, moment, ApiHelpers) {
        this.moment = moment;
        this.pool = pool;
        this.ApiHelpers = ApiHelpers;
    }

    handleEvent(event, context, callback) {
        let date = dateUtils.todayInEST().add(14, 'days').format("YYYY-MM-DD");
        const timeSlotsPromise = this.getTimeSlotsForDate(date);
        const carSlotsPromise = this.getCarSlotsForDate(date);

        Promise.all([timeSlotsPromise, carSlotsPromise])
            .then((promiseResults) => this.transformData(promiseResults))
            .then((transformedData) => this.successHandler(callback, transformedData), (error) => this.errorHandler(callback, error))
        ;
    }

    getTimeSlotsForDate(date) {
        return this.pool.doQuery("select * from time_slot where date <= ? and date >= ? order by date asc;", [date, dateUtils.todayInESTFormatted()]);
    }

    getCarSlotsForDate(date) {
        return this.pool.doQuery("select cs.* from car_slot cs, time_slot ts where cs.time_slot_id = ts.id and ts.date <= ? and date >= ?", [date, dateUtils.todayInESTFormatted()]);
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
                date: this.moment(timeSlot.date).format("YYYY-MM-DD"),
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

exports.GetTimeSlots = GetTimeSlots;
exports.handler = (event, context, callback) => {
    const handler = new GetTimeSlots(new BetterSmartExperienceMySQLPool(), moment, ApiHelpers);
    handler.handleEvent(event, context, callback);
};