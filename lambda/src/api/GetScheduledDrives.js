const smartExperienceMySQLPool = require('../utils/SmartExperienceMySQLPool');
const moment = require('moment');
const ApiHelpers = require('./ApiHelpers');

class GetScheduledDrives {
    constructor(pool, moment, ApiHelpers) {
        this.moment = moment;
        this.pool = pool;
        this.ApiHelpers = ApiHelpers;

    }

    handleEvent(event, context, callback) {
        let date = this.moment().format("YYYY-MM-DD");
        if (event.queryStringParameters !== null) {
            date = this.moment(event.queryStringParameters.date).format("YYYY-MM-DD");
        }
        this.getData(date)
            .then((rows) => this.transformData(rows))
            .then((transformedData) => this.successHandler(callback, transformedData), (error) => this.errorHandler(callback, error))
        ;
    }

    getData(date) {
        return this.doQuery("select u.first_name, u.email, d.date, d.scheduled_start_time, udm.confirmation_number, c.make, c.model from drive d, car c, user_drive_map udm, user u where d.car_id = c.id and udm.drive_id = d.id and udm.user_id = u.id and date = ?", [date]);
    }

    transformData(rows) {
        return rows.map((row) => {
            return {
                first_name: row.first_name,
                confirmation_number: row.confirmation_number,
                date: row.date,
                scheduled_start_time: row.scheduled_start_time,
                make: row.make,
                model: row.model,
                email: this.maskEmail(row.email)
            }
        });
    }

    maskEmail(email) {
        const indexOfAt = email.indexOf("@");
        const firstTwoLetters = email.slice(0, 2);
        const domain = email.slice(indexOfAt, email.length);
        const asterisks = "*******";
        return `${firstTwoLetters}${asterisks}${domain}`;
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
        this.ApiHelpers.httpResponse(callback, 200, data);
    }

    errorHandler(callback, error) {
        smartExperienceMySQLPool.closePool(this.pool);
        console.log(`ERROR: ${error}`);
        this.ApiHelpers.httpResponse(callback, 500, {error: 'An error occurred when processing your request.'});
    }
}

exports.GetScheduledDrives = GetScheduledDrives;
exports.handler = (event, context, callback) => {
    const handler = new GetScheduledDrives(smartExperienceMySQLPool.newPool(), moment, ApiHelpers);
    handler.handleEvent(event, context, callback);
};