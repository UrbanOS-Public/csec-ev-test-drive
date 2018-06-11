const moment = require('moment');
const smartExperienceMySQLPool = require('./utils/SmartExperienceMySQLPool');
const SQL_PART = `from car_schedule where date < ?`

class JobArchiveCarSchedule {
    constructor(pool, moment) {
        this.pool = pool;
        this.moment = moment;
    }

    handleEvent(event, context, callback) {
        const yesterday = this.moment().subtract(1, 'days').format("YYYY-MM-DD");
        this.archiveCarSchedules(yesterday)
            .then(() => this.deleteCarSchedules(yesterday))
            .then(() => this.successHandler(callback), (err) => this.errorHandler(callback, err))
        ;
    }

    archiveCarSchedules(yesterday) {
        return new Promise((resolve, reject) => {
            const query = `insert into archive_car_schedule select * ${SQL_PART}`;
            this.pool.query(query, [yesterday], function (error, results) {
                if (error) {
                    return reject(error);
                } else {
                    return resolve(results);
                }
            });
        });
    }

    deleteCarSchedules(yesterday) {
        return new Promise((resolve, reject) => {
            const query = `delete ${SQL_PART}`;
            this.pool.query(query, [yesterday], function (error, results) {
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
        callback(null);
    }

    errorHandler(callback, error) {
        smartExperienceMySQLPool.closePool(this.pool);
        console.log(`ERROR: ${error}`);
        callback(error);
    }
}

exports.JobArchiveCarSchedule = JobArchiveCarSchedule;
exports.handler = (event, context, callback) => {
    const jobArchiveCarSchedule = new JobArchiveCarSchedule(smartExperienceMySQLPool.newPool(), moment);
    jobArchiveCarSchedule.handleEvent(event, context, callback);
};