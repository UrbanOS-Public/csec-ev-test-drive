const moment = require('moment');
const {BetterSmartExperienceMySQLPool} = require('./utils/BetterSmartExperienceMySQLPool');

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
        return this.pool.doQuery('select * from car');
    }

    getMostRecentSchedulesForCars(cars) {
        const data = cars.map((car) => {
            return new Promise((resolve, reject) => {
                const query = 'select * from car_schedule where car_id = ? order by date desc limit 1;';
                this.pool.doQuery(query, [car.id])
                    .then((results) => {
                        resolve({car: car, car_schedule: results[0]});
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        });

        return Promise.all(data);
    }

    createNewSchedules(carsAndSchedules) {
        const promises = carsAndSchedules.map((carAndSchedule) => {





            const car = carAndSchedule.car;
            const car_schedule = carAndSchedule.car_schedule;

            var active = 0;
            if (car_schedule) {
                active = car_schedule.active;
            }
            const daysFromNowToProduceFor = 180;
            var values = [];
            for (var i = 0; i <= daysFromNowToProduceFor; i++) {
                values.push([car.id, this.moment().add(i, 'days').startOf('day').format("YYYY-MM-DD"), active]);
            }

            const query = 'insert ignore into car_schedule (car_id, date, active) values ? on duplicate key update active = values(active)';
            return this.pool.doQuery(query, [values]);

        });
        return Promise.all(promises);
    }

    successHandler(callback) {
        this.pool.end();
        console.log(`Done`);
        callback(null);
    }

    errorHandler(callback, error) {
        this.pool.end();
        console.log(`ERROR: ${error}`);
        callback(error);
    }
}

exports.JobPopulateCarSchedule = JobPopulateCarSchedule;
exports.handler = (event, context, callback) => {
    const jobPopulateCarSchedule = new JobPopulateCarSchedule(new BetterSmartExperienceMySQLPool(), moment);
    jobPopulateCarSchedule.handleEvent(event, context, callback);
};