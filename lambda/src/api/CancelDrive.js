const moment = require('moment');
const {BetterSmartExperienceMySQLPool} = require('../utils/BetterSmartExperienceMySQLPool');
const ApiHelpers = require('./ApiHelpers');
const dateUtils = require('../utils/DateUtils');

class CancelDrive {
    constructor(pool, moment, ApiHelpers) {
        this.moment = moment;
        this.pool = pool;
        this.ApiHelpers = ApiHelpers;
    }

    handleEvent(event, context, callback) {
        if (!event.body) {
            return this.ApiHelpers.httpResponse(callback, 404);
        }
        const body = JSON.parse(event.body);
        const confirmationNumber = body.confirmationNumber;
        const pin = body.pin;
        if ("***REMOVED***" !== pin) {
            return this.ApiHelpers.httpResponse(callback, 404);
        }
        this.getDrive(confirmationNumber)
            .then((driveAndUserDriveMap) => this.deleteDriveAndUserDriveMap(driveAndUserDriveMap))
            .then((driveAndUserDriveMap) => this.incrementTimeSlotAvailableCount(driveAndUserDriveMap))
            .then(([driveAndUserDriveMap, timeSlotId]) => this.setCarSlotAsAvailable(driveAndUserDriveMap, timeSlotId))
            .then((data) => this.successHandler(callback, data), (err) => this.errorHandler(callback, err))
        ;
    }

    getDrive(confirmationNumber) {
        return this.pool.doQueryFirstRow("select * from drive d, user_drive_map udm where d.id = udm.drive_id and udm.confirmation_number = ?", [confirmationNumber]);
    }

    deleteDriveAndUserDriveMap(driveAndUserDriveMap) {
        if (driveAndUserDriveMap === undefined) {
            return Promise.reject("Could not find the appropriate drive and user_drive_map to delete");
        }
        return new Promise((resolve, reject) => {
            this.pool.doQuery("delete udm from user_drive_map udm where udm.user_id = ? and udm.drive_id = ?", [driveAndUserDriveMap.user_id, driveAndUserDriveMap.drive_id])
                .then(() => {
                    this.pool.doQuery("delete from drive where id = ?", [driveAndUserDriveMap.drive_id])
                        .then(() => {
                            resolve(driveAndUserDriveMap);
                        })
                        .catch(err => {
                            reject(err);
                        });
                })
                .catch((err) => {
                    reject(err);
                })
        });
    }

    incrementTimeSlotAvailableCount(driveAndUserDriveMap) {
        return new Promise((resolve, reject) => {
            const params = [dateUtils.yearMonthDayFormat(driveAndUserDriveMap.date), driveAndUserDriveMap.scheduled_start_time];
            this.pool.doQueryFirstRow("select * from time_slot where date = ? and start_time  = ?", params)
                .then((timeSlotQuery) => {
                    if (timeSlotQuery !== undefined) {
                        this.pool.doQuery("update time_slot set available_count = available_count + 1 where id = ?", [timeSlotQuery.id])
                            .then(() => {
                                resolve([driveAndUserDriveMap, timeSlotQuery.id]);
                            })
                            .catch(err => {
                                reject(err);
                            });
                    } else {
                        resolve([driveAndUserDriveMap, undefined])
                    }
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    setCarSlotAsAvailable(driveAndUserDriveMap, timeSlotId) {
        return new Promise((resolve, reject) => {
            const params = [timeSlotId, driveAndUserDriveMap.car_id];
            this.pool.doQuery("update car_slot set reserved = 0 where time_slot_id = ? and car_id = ?", params)
                .then(() => {
                    resolve(driveAndUserDriveMap);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    successHandler(callback, data) {
        this.pool.end();
        console.log(`Deleted: ${JSON.stringify(data)}`);
        console.log(`Done`);
        this.ApiHelpers.httpResponse(callback, 200, "Ride canceled successfully");
    }

    errorHandler(callback, error) {
        console.log(`END`);
        this.pool.end();
        console.log(`ERROR: ${error}`);
        this.ApiHelpers.httpResponse(callback, 500, {error: 'An error occurred when processing your request.'});
    }
}

exports.CancelDrive = CancelDrive;
exports.handler = (event, context, callback) => {
    const handler = new CancelDrive(new BetterSmartExperienceMySQLPool(), moment, ApiHelpers);
    handler.handleEvent(event, context, callback);
};