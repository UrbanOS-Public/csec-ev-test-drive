const moment = require('moment');
const {BetterSmartExperienceMySQLPool} = require('../utils/BetterSmartExperienceMySQLPool');
const ApiHelpers = require('./ApiHelpers');
const extend = require('extend');

const ALREADY_RESERVED_MESSAGE = "Sorry that time slot has been reserved by someone else, please select another car/time combination.";

class ScheduleAdhocDrive {
    constructor(pool, moment, ApiHelpers) {
        this.moment = moment;
        this.pool = pool;
        this.ApiHelpers = ApiHelpers;
    }

    handleEvent(event, context, callback) {
        console.log("this is the event object", event);
        console.log("this is the event body", event.body);

        const body = event.body;
        const email = body.email;
        const selectedCar = body.selectedCar;
        const reservation = body.reservation;

        this.getUserData(email)
            .then((userData) => this.insertDrive(userData, selectedCar, reservation))
            .then((data) => this.successHandler(callback, data), (error) => this.errorHandler(callback, error))
        ;
    }

    getUserData(email) {
        const userPromise = this.pool.doQuery("select * from user where email = ?", email);

        return Promise.resolve(userPromise);
    }

    insertDrive(userData, selectedVehicle, reservation) {
        const user = userData[0];
        const userId = user.id;
        const car_id = selectedVehicle.id;
        const date = reservation.date;
        const start_time = reservation.start_time;
        const end_time = reservation.end_time;

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

exports.ScheduleAdhocDrive = ScheduleAdhocDrive;
exports.handler = (event, context, callback) => {
    const handler = new ScheduleAdhocDrive(new BetterSmartExperienceMySQLPool(), moment, ApiHelpers);
    handler.handleEvent(event, context, callback);
};