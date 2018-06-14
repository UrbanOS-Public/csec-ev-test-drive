const moment = require('moment');
const smartExperienceMySQLPool = require('../utils/SmartExperienceMySQLPool');
const ApiHelpers = require('./ApiHelpers');

class GetCars {
    constructor(moment, pool, ApiHelpers) {
        this.moment = moment;
        this.pool = pool;
        this.ApiHelpers = ApiHelpers;
    }

    handleEvent(event, context, callback) {
        this.getCars()
            .then((rows) => this.transformCarData(rows))
            .then((data) => this.successHandler(callback, data), (err) => this.errorHandler(callback, err))
        ;
    }

    getCars() {
        return new Promise((resolve, reject) => {
            const today = this.moment().format("YYYY-MM-DD");
            const query = `select c.*, ifnull(cs.active, 0) as active from car c left outer join car_schedule cs on cs.car_id = c.id and cs.date = ?`;
            this.pool.query(query, [today], function (error, results) {
                if (error) {
                    return reject(error);
                } else {
                    return resolve(results);
                }
            });
        });
    }

    transformCarData(rows) {
        return rows.map((row) => {
            return {
                id: row.id,
                year: row.year,
                make: row.make,
                model: row.model,
                imageUrl: row.image_url,
                active: row.active !== 0,
                type: row.type,
                specs: {
                    msrp: row.msrp,
                    evRange: row.ev_range,
                    totalRange: row.total_range,
                    battery: row.battery_size,
                    chargingStandard: row.charging_standard,
                    chargeTime: row.charge_time
                }
            }
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
        this.ApiHelpers.httpResponse(callback, 500, {error: error});
    }
}

exports.GetCars = GetCars;
exports.handler = (event, context, callback) => {
    const handler = new GetCars(moment, smartExperienceMySQLPool.newPool(), ApiHelpers);
    handler.handleEvent(event, context, callback);
};