const moment = require('moment');
const smartExperienceMySQLPool = require('./utils/SmartExperienceMySQLPool');

class JobPopulateCarSchedule {
    constructor(pool, moment) {
        this.pool = pool;
        this.moment = moment;
    }

    handleEvent(event, context, callback) {

        this.getCurrentCars()
            .then((cars) => this.getMostRecentSchedulesForCars(cars))
            .then((carsAndSchedules) => this.createNewSchedules(carsAndSchedules))
            .then((updateResponses) => this.successHandler(callback, updateResponses), (err) => this.errorHandler(callback, err))
        ;
    }

    getCurrentCars() {
        return new Promise((resolve, reject) => {
            const query = 'select * from car';
            this.pool.query(query, {}, function (error, results) {
                if (error) {
                    return reject(error);
                } else {
                    return resolve(results);
                }
            });
        });
    }

    getMostRecentSchedulesForCars(cars) {
        const data = cars.map((car) => {
            return new Promise((resolve, reject) => {
                const query = 'select * from car_schedule where car_id = ? order by date desc limit 1;';
                this.pool.query(query, [car.id], function (error, results) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({car: car, car_schedule: results[0]});
                    }
                });
            });
        });

        return Promise.all(data);
    }

    createNewSchedules(carsAndSchedules) {
        const promises = carsAndSchedules.map((carAndSchedule) => {
            return new Promise((resolve, reject) => {
                const car = carAndSchedule.car;
                const car_schedule = carAndSchedule.car_schedule;

                var active = 0;
                if (car_schedule) {
                    active = car_schedule.active;
                }
                const daysFromNowToProduceFor = 180;
                var values = [];
                for (var i = 1; i <= daysFromNowToProduceFor; i++) {
                    values.push([car.id, this.moment().add(i, 'days').startOf('day').format("YYYY-MM-DD"), active]);
                }
                this.pool.query('insert ignore into car_schedule (car_id, date, active) values ? on duplicate key update active = values(active)', [values], (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });

            });
        });
        return Promise.all(promises);
    }

    successHandler(callback) {
        smartExperienceMySQLPool.closePool(this.pool);
        console.log(`Done`);
        callback(null);
    }

    errorHandler(callback, error) {
        smartExperienceMySQLPool.closePool(this.pool);
        console.log(`ERROR: ${error}`);
        callback(error);
    }
}

exports.JobPopulateCarSchedule = JobPopulateCarSchedule;
exports.handler = (event, context, callback) => {
    const jobPopulateCarSchedule = new JobPopulateCarSchedule(smartExperienceMySQLPool.newPool(), moment);
    jobPopulateCarSchedule.handleEvent(event, context, callback);
};