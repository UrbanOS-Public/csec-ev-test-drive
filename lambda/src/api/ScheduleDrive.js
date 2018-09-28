const moment = require('moment');
const {BetterSmartExperienceMySQLPool} = require('../utils/BetterSmartExperienceMySQLPool');
const ApiHelpers = require('./ApiHelpers');
const extend = require('extend');

const ALREADY_RESERVED_MESSAGE = "Sorry that time slot has been reserved by someone else, please select another car/time combination.";

class ScheduleDrive {
    constructor(pool, moment, ApiHelpers) {
        this.moment = moment;
        this.pool = pool;
        this.ApiHelpers = ApiHelpers;
    }

    handleEvent(event, context, callback) {
        const body = JSON.parse(event.body);
        const carSlotId = body.carSlotId;
        const email = body.email;
        this.verifySlot(carSlotId)
            .then((updateResponse) => this.validateResponse(email, updateResponse))
            .then(() => this.getUserAndDriveData(email, carSlotId))
            .then((userAndDriveData) => this.insertDrive(userAndDriveData))
            .then((data) => this.successHandler(callback, data), (error) => this.errorHandler(callback, error))
        ;
    }

    verifySlot(car_slot_id) {
        return this.pool.doQuery("select reserved_by from car_slot where id = ?", car_slot_id);
    }

    validateResponse(email, verifyResponse) {
        console.log(verifyResponse);
        if (verifyResponse[0].reserved_by !== email) {
            return Promise.reject(ALREADY_RESERVED_MESSAGE);
        }
        return {};
    }

    getUserAndDriveData(email, carSlotId) {
        const userPromise = this.pool.doQuery("select * from user where email = ?", email);
        const carSlotPromise = this.pool.doQuery("select cs.car_id, ts.date, ts.start_time, ts.end_time from car_slot cs, time_slot ts where cs.time_slot_id = ts.id and cs.id = ?", carSlotId);
        return Promise.all([userPromise, carSlotPromise]);
    }

    insertDrive(userAndDriveData) {
        const user = userAndDriveData[0][0];
        const userId = user.id;
        const carTimeSlotData = userAndDriveData[1][0];
        const car_id = carTimeSlotData.car_id;
        const date = carTimeSlotData.date;
        const start_time = carTimeSlotData.start_time;
        const end_time = carTimeSlotData.end_time;
        const driveData = {
            car_id: car_id,
            date: date,
            scheduled_start_time: start_time,
            scheduled_end_time: end_time
        };
        return new Promise((resolve, reject) => {
            this.pool.doQuery("insert into drive set ?", driveData)
                .then((insertResponse) => {
                    const drive_id = insertResponse.insertId;
                    const confirmation_number = `${user.first_name.slice(0, 1).toUpperCase()}${user.last_name.slice(0, 1).toUpperCase()}${drive_id}`;
                    const userDriveMap = {
                        user_id: userId,
                        drive_id: drive_id,
                        role: "DRIVER",
                        confirmation_number: confirmation_number
                    };
                    console.log(userDriveMap);
                    this.pool.doQuery("insert into user_drive_map set ?", userDriveMap)
                        .then(() => {
                            resolve({confirmation_number: confirmation_number});
                        })
                        .catch(err => {
                            reject(err);
                        });
                })
        });
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

exports.ScheduleDrive = ScheduleDrive;
exports.handler = (event, context, callback) => {
    const handler = new ScheduleDrive(new BetterSmartExperienceMySQLPool(), moment, ApiHelpers);
    handler.handleEvent(event, context, callback);
};