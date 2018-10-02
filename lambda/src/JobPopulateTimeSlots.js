const moment = require('moment');
const {BetterSmartExperienceMySQLPool} = require('./utils/BetterSmartExperienceMySQLPool');

class JobPopulateTimeSlots {
    constructor(pool, moment) {
        this.pool = pool;
        this.moment = moment;
    }

    handleEvent(event, context, callback) {
        const yesterday = this.moment().subtract(1, 'days').format("YYYY-MM-DD");
        const today = this.moment(event.date);
        const endOfPeriod = this.moment(event.date).add(14, 'days');
        const dayOfTheWeekStartingSundayZeroBased = this.moment().day();

        this.archiveCarSlots(yesterday)
            .then(() => this.deleteCarSlots(yesterday))
            .then(() => this.archiveTimeSlots(yesterday))
            .then(() => this.deleteTimeSlots(yesterday))
            .then(() => this.getScheduleForToday(today.format("YYYY-MM-DD"), dayOfTheWeekStartingSundayZeroBased))
            .then((schedule) => this.createTimeSlotsForPeriod(schedule, today, endOfPeriod))
            .then(() => this.createCarSlotsForPeriod(today, endOfPeriod))
            .then((updateResponses) => this.successHandler(callback, updateResponses), (err) => this.errorHandler(callback, err))
        ;
    }

    archiveCarSlots(yesterday) {
        const query = `insert into archive_car_slot select cs.* from car_slot cs, time_slot ts where cs.time_slot_id = ts.id and ts.date = ?`;
        return this.pool.doQuery(query, [yesterday]);
    }

    deleteCarSlots(yesterday) {
        const query = `delete cs from car_slot cs, time_slot ts where cs.time_slot_id = ts.id`;
        return this.pool.doQuery(query, [yesterday]);
    }

    archiveTimeSlots(yesterday) {
        const query = `insert into archive_time_slot select * from time_slot ts where ts.date = ?`;
        return this.pool.doQuery(query, [yesterday]);
    }

    deleteTimeSlots(yesterday) {
        const query = `delete ts from time_slot ts`;
        return this.pool.doQuery(query, [yesterday]);
    }

    getScheduleForToday(today, dayOfTheWeekStartingSundayZeroBased) {
        const scheduleExceptionPromise = this.pool.doQuery(`select * from schedule_exception where date = ?`, today);
        const defaultSchedulePromise = this.pool.doQuery(`select * from schedule where day_of_the_week = ?`, dayOfTheWeekStartingSundayZeroBased);

        return Promise.all([scheduleExceptionPromise, defaultSchedulePromise])
            .then((data) => {
                const scheduleException = data[0][0];
                const defaultSchedule = data[1][0];
                if (scheduleException) {
                    return scheduleException;
                } else {
                    return defaultSchedule;
                }
            });
    }

    createTimeSlotsForPeriod(schedule, start, end) {
        var timePromises = [];
        const days = end.diff(start, 'days');
        for (var i = 0; i < days; i++) {
            const formattedDate = moment(start).add(i, 'days').format(("YYYY-MM-DD"));
            timePromises.push(this.createTimeSlotsForDate(schedule, formattedDate));
        }
        return Promise.all(timePromises);
    }

    createCarSlotsForPeriod(start, end) {
        var carPromises = [];
        const days = end.diff(start, 'days');
        for (var i = 0; i < days; i++) {
            const formattedDate = moment(start).add(i, 'days').format(("YYYY-MM-DD"));
            carPromises.push(this.createCarSlotsForDate(formattedDate));
        }
        return Promise.all(carPromises);
    }

    createTimeSlotsForDate(schedule, formattedDate) {
        const dayStartTime = schedule.start_time;
        const dayEndTime = schedule.end_time;
        const available_count = schedule.employees_per_slot;
        const slot_length_minutes = schedule.slot_length_minutes;

        const start = this.moment(`${formattedDate} ${dayStartTime}`);
        const end = this.moment(`${formattedDate} ${dayEndTime}`);
        const diffInMilliseconds = end.diff(start);
        const lengthOfDayInMinutes = diffInMilliseconds / 1000 / 60;
        const numberOfSlots = lengthOfDayInMinutes / slot_length_minutes;

        let values = [];
        for (var i = 0; i < numberOfSlots; i++) {
            const row_start_time = this.moment(`${formattedDate} ${dayStartTime}`).add(i * slot_length_minutes, 'minutes').format("HH:mm:ss");
            const row_end_time = this.moment(`${formattedDate} ${dayStartTime}`).add((i + 1) * slot_length_minutes, 'minutes').format("HH:mm:ss");
            const row = [formattedDate, row_start_time, row_end_time, available_count];
            values.push(row);
        }
        return this.pool.doQuery("insert ignore into time_slot (`date`, `start_time`, `end_time`, `available_count`) values ? on duplicate key update end_time = values(end_time)", [values]);
    }

    createCarSlotsForDate(date) {
        const timeSlotsPromise = this.pool.doQuery("select * from time_slot where date = ?", [date]);
        const activeCarsPromise = this.pool.doQuery("select * from car_schedule where date = ? and active = ?", [date, true]);

        return Promise.all([timeSlotsPromise, activeCarsPromise])
            .then((data) => {
                const timeSlots = data[0];
                const cars = data[1];
                var values = [];
                for (var i = 0; i < timeSlots.length; i++) {
                    var timeSlot = timeSlots[i];
                    for (var j = 0; j < cars.length; j++) {
                        var car = cars[j];
                        values.push([timeSlot.id, car.car_id, false]);
                    }
                }
                
                return this.pool.doQuery("insert ignore into car_slot (`time_slot_id`, `car_id`, `reserved`) values ?", [values]);
            })
            .catch(err => {
                console.log(`rejecting`);
                console.log(err);
                return Promise.reject(err)
            });
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

exports.JobPopulateTimeSlots = JobPopulateTimeSlots;
exports.handler = (event, context, callback) => {
    const jobPopulateTimeSlots = new JobPopulateTimeSlots(new BetterSmartExperienceMySQLPool(), moment);
    jobPopulateTimeSlots.handleEvent(event, context, callback);
};