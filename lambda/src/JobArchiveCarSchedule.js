const moment = require('moment');
const {BetterSmartExperienceMySQLPool} = require('./utils/BetterSmartExperienceMySQLPool');
const SQL_PART = `from car_schedule where date < ?`;

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
        const query = `insert into archive_car_schedule select * ${SQL_PART}`;
        return this.pool.doQuery(query, [yesterday]);
    }

    deleteCarSchedules(yesterday) {
        const query = `delete ${SQL_PART}`;
        return this.pool.doQuery(query, [yesterday]);
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

exports.JobArchiveCarSchedule = JobArchiveCarSchedule;
exports.handler = (event, context, callback) => {
    const jobArchiveCarSchedule = new JobArchiveCarSchedule(new BetterSmartExperienceMySQLPool(), moment);
    jobArchiveCarSchedule.handleEvent(event, context, callback);
};