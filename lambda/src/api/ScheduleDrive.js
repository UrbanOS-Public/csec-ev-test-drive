const moment = require('moment');
const smartExperienceMySQLPool = require('../utils/SmartExperienceMySQLPool');
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
        this.reserveSlot(carSlotId)
            .then((updateResponse) => this.validateResponse(updateResponse))
            .then(() => this.getUserAndDriveData(email, carSlotId))
            .then((userAndDriveData) => this.insertDrive(userAndDriveData))
            .then((data) => this.successHandler(callback, data), (error) => this.errorHandler(callback, error))
        ;
    }

    reserveSlot(car_slot_id) {
        return this.doQuery("update time_slot ts, car_slot cs set ts.available_count = ts.available_count - 1, cs.reserved = 1 where ts.id = cs.time_slot_id and ts.available_count >= 1 and cs.reserved = 0 and cs.id = ?", car_slot_id)
    }

    validateResponse(updateResponse) {
        if (updateResponse.changedRows !== 2) {
            return Promise.reject(ALREADY_RESERVED_MESSAGE);
        }
        return {};
    }

    getUserAndDriveData(email, carSlotId) {
        const userPromise = this.doQuery("select * from user where email = ?", email);
        const carSlotPromise = this.doQuery("select cs.car_id, ts.date, ts.start_time, ts.end_time from car_slot cs, time_slot ts where cs.time_slot_id = ts.id and cs.id = ?", carSlotId);
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
            this.doQuery("insert into drive set ?", driveData)
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
                    this.doQuery("insert into user_drive_map set ?", userDriveMap)
                        .then(() => {
                            resolve({confirmation_number: confirmation_number});
                        })
                        .catch(err => {
                            reject(err);
                        });
                })
        });
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

    successHandler(callback, data) {
        smartExperienceMySQLPool.closePool(this.pool);
        console.log(`Done`);
        const response = extend({message: "Success"}, data);
        this.ApiHelpers.httpResponse(callback, 200, response);
    }

    errorHandler(callback, error) {
        smartExperienceMySQLPool.closePool(this.pool);
        console.log(`ERROR: ${error}`);
        var errorToSend = 'An error occurred when processing your request.';
        if (error !== undefined && error.toString().indexOf(ALREADY_RESERVED_MESSAGE) === 0) {
            errorToSend = error;
        }
        this.ApiHelpers.httpResponse(callback, 500, {errors: errorToSend});
    }
}

exports.ScheduleDrive = ScheduleDrive;
exports.handler = (event, context, callback) => {
    const handler = new ScheduleDrive(smartExperienceMySQLPool.newPool(), moment, ApiHelpers);
    handler.handleEvent(event, context, callback);
};