const moment = require('moment');
const {BetterSmartExperienceMySQLPool} = require('./utils/BetterSmartExperienceMySQLPool');

class JobReleaseTimeSlots {
    constructor(pool, moment) {
        this.pool = pool;
        this.moment = moment;
    }

    handleEvent(event, context, callback) {
        this.getReservedUnscheduledTimeSlots()
            .then((timeSlots) => this.releaseExpiredTimeSlots(timeSlots))
            .then((updateResponses) => this.successHandler(callback, updateResponses), (err) => this.errorHandler(callback, err))
        ;
    }

    getReservedUnscheduledTimeSlots() {
        return this.pool.doQuery(`select * from car_slot where car_slot.id not in (select car_slot.id from car_slot join user on car_slot.reserved_by = user.email join user_drive_map on user.id = user_drive_map.user_id) and reserved = 1;`);
    }

    releaseExpiredTimeSlots(timeSlots){
        var promises = [];
        timeSlots.forEach(slot => {
            var now = moment(new Date());
            var end = moment(slot.last_updated);
            var duration = moment.duration(now.diff(end));
            const timeout = process.env.timeout_in_minutes || 5;
            if (duration.asMinutes() > timeout) {
                promises.push(this.pool.doQuery("update time_slot ts, car_slot cs set ts.available_count = ts.available_count + 1, cs.reserved = 0, cs.reserved_by = null where ts.id = cs.time_slot_id and cs.id = ?", [slot.id]));
            }
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

exports.JobReleaseTimeSlots = JobReleaseTimeSlots;
exports.handler = (event, context, callback) => {
    const jobReleaseTimeSlots = new JobReleaseTimeSlots(new BetterSmartExperienceMySQLPool(), moment);
    jobReleaseTimeSlots.handleEvent(event, context, callback);
};