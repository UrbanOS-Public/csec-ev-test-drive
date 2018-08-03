const {BetterSmartExperienceMySQLPool} = require("../../utils/BetterSmartExperienceMySQLPool");
const moment = require('moment');
const ApiHelpers = require('../ApiHelpers');

class UpdateSchedule {
    constructor(pool, moment, ApiHelpers) {
        this.pool = pool;
        this.moment = moment;
        this.ApiHelpers = ApiHelpers;
    }

    handleEvent(event, context, callback) {

        // this.updateSchedule()
        this.validateEvent(event)
            .then((jsonBody) => this.updateSchedule(jsonBody))
            .then((data) => this.successHandler(callback, data), (err) => this.errorHandler(callback, err))
        ;
    }

    validateEvent(event) {
        try {
            const jsonBody = JSON.parse(event.body);
            const requiredFields = ['id', 'start_time', 'end_time', 'slot_length_minutes', 'employees_per_slot'];
            let missingRequiredFields = [];
            requiredFields.forEach((requiredField) => {
                if (jsonBody[requiredField] === undefined) {
                    missingRequiredFields.push(requiredField);
                }
            });
            if (missingRequiredFields.length > 0) {
                return Promise.reject({
                    statusCode: 400,
                    error: `Missing required fields ${missingRequiredFields.join(", ")}`
                })
            }
            return Promise.resolve(jsonBody);
        } catch (e) {
            return Promise.reject({statusCode: 400, error: "Invalid message body"})
        }
    }

    updateSchedule(jsonBody) {
        const data = [
            this.moment(jsonBody.start_time, "h:mm a").format("HH:mm:ss"),
            this.moment(jsonBody.end_time, "h:mm a").format("HH:mm:ss"),
            jsonBody.slot_length_minutes,
            jsonBody.employees_per_slot,
            jsonBody.id
        ];
        return this.pool.doQuery("update schedule set start_time = ?, end_time = ?, slot_length_minutes = ?, employees_per_slot = ? where id = ?", data);
    }


    successHandler(callback, data) {
        this.pool.end();
        console.log(`Done`);
        this.ApiHelpers.httpResponse(callback, 200, {message: "Successfully updated schedule"});
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

exports.UpdateSchedule = UpdateSchedule;
exports.handler = (event, context, callback) => {
    const handler = new UpdateSchedule(new BetterSmartExperienceMySQLPool(), moment, ApiHelpers);
    handler.handleEvent(event, context, callback);
};