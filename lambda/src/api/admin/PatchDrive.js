const moment = require('moment');
const {BetterSmartExperienceMySQLPool} = require('../../utils/BetterSmartExperienceMySQLPool');
const ApiHelpers = require('../ApiHelpers');
const extend = require('extend');

class PatchDrive { //Should be a patch in terraform/AWS. We had issues with non post/get api gateway endpoints. This is set up as a post as a workaround
    constructor(pool, moment, ApiHelpers) {
        this.moment = moment;
        this.pool = pool;
        this.ApiHelpers = ApiHelpers;
    }

    handleEvent(event, context, callback) {
        const body = JSON.parse(event.body);
        const carId = body.vehicle;
        const selectedDay = body.day;
        const selectedTime = body.time;
        const confirmationNumber = body.confirmation_number;
        const newReservation = body;

        const pin = body.pin;
        if ("17043215" !== pin) {
            return this.ApiHelpers.httpResponse(callback, 404);
        }
        this.getDrive(confirmationNumber)
            .then((drive) => this.releaseTimeSlot(drive))
            .then(() => this.getUser(confirmationNumber))
            .then((user) => this.reserveTimeSlot(newReservation, user))
            .then((timeSlot) => this.patchDrive(newReservation, timeSlot))
            .then((data) => this.successHandler(callback, data), (error) => this.errorHandler(callback, error))
        ;
    }

    getDrive(confirmationNumber) {
        return this.pool.doQuery("select * from drive d join user_drive_map udm on d.id = udm.drive_id where confirmation_number = ?", [confirmationNumber])
    }

    getUser(confirmationNumber) {
        return this.pool.doQuery("select * from drive d, user_drive_map udm where d.id = udm.drive_id and udm.confirmation_number = ?", [confirmationNumber]);
    }

    releaseTimeSlot(drive){
        return this.pool.doQuery("update time_slot ts, car_slot cs set ts.available_count = ts.available_count + 1, cs.reserved = 0, cs.reserved_by = null where ts.id = cs.time_slot_id and ts.date = ? and ts.start_time = ?", [drive.date, drive.scheduled_start_time])
    }

    reserveTimeSlot(newReservation, user) {
        return this.pool.doQuery("update time_slot ts, car_slot cs set ts.available_count = ts.available_count - 1, cs.reserved = 1, cs.reserved_by = ? where ts.id = cs.time_slot_id and ts.available_count >= 1 and cs.reserved = 0 and ts.date = ? and ts.start_time = ?", [user.email, newReservation.day, newReservation.time])
    }

    patchDrive(newReservation, timeSlot) {
        return this.pool.doQuery("update drive join user_drive_map on drive.id = user_drive_map.drive_id set date = ?, scheduled_start_time = ?, scheduled_end_time = ?, car_id = ? where confirmation_number = ?", [newReservation.day, timeSlot.start_time, timeSlot.end_time, newReservation.vehicle, newReservation.confirmationNumber]);
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
        if (error !== undefined && error.toString().indexOf("Car not found") === 0) {
            return this.ApiHelpers.httpResponse(callback, 404, {errors: error});
        }
        this.ApiHelpers.httpResponse(callback, 500, {errors: 'An error occurred when processing your request.'});
    }
}

exports.PatchDrive = PatchDrive;
exports.handler = (event, context, callback) => {
    const handler = new PatchDrive(new BetterSmartExperienceMySQLPool(), moment, ApiHelpers);
    handler.handleEvent(event, context, callback);
};