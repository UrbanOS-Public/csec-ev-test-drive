const moment = require('moment');
const smartExperienceMySQLPool = require('../utils/SmartExperienceMySQLPool');
const ApiHelpers = require('./ApiHelpers');
const email_validator = require('email-validator');

class SaveUser {
    constructor(pool, moment, ApiHelpers) {
        this.moment = moment;
        this.pool = pool;
        this.ApiHelpers = ApiHelpers;
    }

    handleEvent(event, context, callback) {
        const body = JSON.parse(event.body);

        if (!email_validator.validate(body.email)) {
            console.log(`Email failed validation ${body.email}`);
            return this.ApiHelpers.httpResponse(callback, 400, {errors: ["Email is malformed"]});
        }
        const requiredFields = ['firstName', 'lastName', 'phone', 'zip'];
        var errors = [];
        requiredFields.forEach((field) => {
            const value = body[field];
            if (value === undefined || value.trim() === '') {
                errors.push(`Field '${field}' is required and was '${value}'`);
            }
        });
        if (errors.length > 0) {
            return this.ApiHelpers.httpResponse(callback, 400, {errors: errors});
        }

        this.saveUser(body)
            .then(() => this.successHandler(callback), (err) => this.errorHandler(callback, err))
        ;
    }

    saveUser(body) {
        return new Promise((resolve, reject) => {
            const user = {
                email: body.email,
                first_name: body.firstName,
                last_name: body.lastName,
                phone: body.phone,
                zipcode: body.zip
            };
            const query = `insert ignore into user set ? on duplicate key update first_name = values(first_name), last_name = values(last_name), phone = values(phone), zipcode = values(zipcode)`;
            this.pool.query(query, user, function (error, results) {
                if (error) {
                    return reject(error);
                } else {
                    return resolve(results);
                }
            });
        });
    }

    successHandler(callback) {
        smartExperienceMySQLPool.closePool(this.pool);
        console.log(`Done`);
        this.ApiHelpers.httpResponse(callback, 200, {message: "Success"});
    }

    errorHandler(callback, error) {
        smartExperienceMySQLPool.closePool(this.pool);
        console.log(`ERROR: ${error}`);
        this.ApiHelpers.httpResponse(callback, 500, {errors: 'An error occurred when processing your request.'});
    }
}

exports.ApiSaveUser = SaveUser;
exports.handler = (event, context, callback) => {
    const handler = new SaveUser(smartExperienceMySQLPool.newPool(), moment, ApiHelpers);
    handler.handleEvent(event, context, callback);
};