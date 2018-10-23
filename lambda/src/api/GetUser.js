const moment = require('moment');
const {BetterSmartExperienceMySQLPool} = require('../utils/BetterSmartExperienceMySQLPool');
const ApiHelpers = require('./ApiHelpers');
const USER_NOT_FOUND = "User not found";
const EMAIL_IS_REQUIRED = "Email or Confirmation Number is required";

class GetUser {
    constructor(pool, moment, ApiHelpers) {
        this.moment = moment;
        this.pool = pool;
        this.ApiHelpers = ApiHelpers;
    }

    handleEvent(event, context, callback) {
        if (this.eventIsInvalid(event)) {
            return this.errorHandler(callback, EMAIL_IS_REQUIRED)
        }

        const email = event.queryStringParameters.email;
        const confirmationNumber = event.queryStringParameters.confirmationNumber;

        var getUserPromise;
        if (email !== undefined) {
            getUserPromise = this.getUser(email);
        } else {
            getUserPromise = this.getUserByConfirmationNumber(confirmationNumber);
        }
        getUserPromise
            .then((rows) => this.transformData(rows))
            .then((data) => this.successHandler(callback, data), (err) => this.errorHandler(callback, err))
        ;
    }

    eventIsInvalid(event) {
        return event.queryStringParameters === null || (event.queryStringParameters.email === undefined && event.queryStringParameters.confirmationNumber === undefined);
    }

    getUser(email) {
        return this.pool.doQuery("select user.id, email, MAX(drive.date) as last_drive from user join user_drive_map udm on user.id = udm.user_id join drive on udm.drive_id = drive.id where email = ?", [email]);
    }

    getUserByConfirmationNumber(confirmationNumber) {
        return this.pool.doQuery("select u.id, u.email from user u, user_drive_map udm where udm.user_id = u.id and udm.confirmation_number = ?", [confirmationNumber]);
    }

    transformData(rows) {
        if (rows.length === 1) {
            return Promise.resolve(rows[0]);
        }
        return Promise.reject(USER_NOT_FOUND);
    }

    successHandler(callback, data) {
        this.pool.end();
        console.log(`Done`);
        this.ApiHelpers.httpResponse(callback, 200, data);
    }

    errorHandler(callback, error) {
        this.pool.end();
        if (USER_NOT_FOUND === error) {
            return this.ApiHelpers.httpResponse(callback, 404, {message: error});
        }
        if (EMAIL_IS_REQUIRED === error) {
            return this.ApiHelpers.httpResponse(callback, 400, {message: error});
        }
        console.log(`ERROR: ${error}`);
        this.ApiHelpers.httpResponse(callback, 500, {error: 'An error occurred when processing your request.'});
    }
}

exports.GetUser = GetUser;
exports.handler = (event, context, callback) => {
    const handler = new GetUser(new BetterSmartExperienceMySQLPool(), moment, ApiHelpers);
    handler.handleEvent(event, context, callback);
};