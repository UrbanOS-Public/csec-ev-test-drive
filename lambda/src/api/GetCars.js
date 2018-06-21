const moment = require('moment');
const {BetterSmartExperienceMySQLPool} = require('../utils/BetterSmartExperienceMySQLPool');
const ApiHelpers = require('./ApiHelpers');

class GetCars {
    constructor(pool, moment, ApiHelpers) {
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
        const today = this.moment().format("YYYY-MM-DD");
        const query = `select c.*, ifnull(cs.active, 0) as active from car c left outer join car_schedule cs on cs.car_id = c.id and cs.date = ?`;
        return this.pool.doQuery(query, [today])
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
        this.pool.end();
        console.log(`Done`);
        this.ApiHelpers.httpResponse(callback, 200, data);
    }

    errorHandler(callback, error) {
        this.pool.end();
        console.log(`ERROR: ${error}`);
        this.ApiHelpers.httpResponse(callback, 500, {error: 'An error occurred when processing your request.'});
    }
}

exports.GetCars = GetCars;
exports.handler = (event, context, callback) => {
    const handler = new GetCars(new BetterSmartExperienceMySQLPool(), moment, ApiHelpers);
    handler.handleEvent(event, context, callback);
};