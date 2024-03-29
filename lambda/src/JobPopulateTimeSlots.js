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

        this.archiveCarSlots(yesterday)
            .then(() => this.deleteCarSlots(yesterday))
            .then(() => this.archiveTimeSlots(yesterday))
            .then(() => this.deleteTimeSlots(yesterday))
            .then(() => this.getSchedulesForWeek(today, endOfPeriod))
            .then((schedules) => this.createTimeSlotsForPeriod(schedules, today, endOfPeriod))
            .then(() => this.createCarSlotsForPeriod(today, endOfPeriod))
            .then(() => this.getFutureReservations())
            .then((futureReservations) => this.reserveFutureSlotsForPeriod(futureReservations))
            .then((updateResponses) => this.successHandler(callback, updateResponses), (err) => this.errorHandler(callback, err))
        ;
    }

    getFutureReservations() {
        const query = `
        select u.email, t.date, t.start_time
            from drive          d 
            join car_slot       s on d.car_id = s.car_id 
            join time_slot      t on s.time_slot_id = t.id 
            join user_drive_map m on m.drive_id = d.id 
            join user           u on m.user_id = u.id 
        where d.scheduled_start_time = t.start_time 
            and d.date = t.date;
        `;
        return this.pool.doQuery(query);
    }

    reserveFutureSlotsForPeriod(futureReservations) { // If there are issues with time slots being mysteriously open even when booked, I would suspect this method.
        let promises = [];
        let query = `
            update time_slot ts, car_slot cs 
                set ts.available_count = ts.available_count - 1, 
                    cs.reserved = 1, 
                    cs.reserved_by = ? 
                where ts.id = cs.time_slot_id and ts.available_count >= 1 
                and cs.reserved = 0 
                and ts.date = ? 
                and ts.start_time = ?
            `;
        
        futureReservations.forEach((reservation) => {
            let formattedDate = moment(reservation.date).format('YYYY-MM-DD');
            promises.push(this.pool.doQuery(query, [reservation.email, formattedDate, reservation.start_time]));
        });
        return Promise.all(promises);
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
                    return {...defaultSchedule, date:today};
                }
            });
    }

    getSchedulesForWeek(start, end) {
        var schedulePromises = []
        const days = end.diff(start, 'days');
        for (var i = 0; i < days; i++) {
            const thisDay = moment(start).add(i, 'days')
            const formattedDate = thisDay.format(("YYYY-MM-DD"));
            const thisDayNumber = thisDay.day();
            schedulePromises.push(this.getScheduleForToday(formattedDate, thisDayNumber));
        }
        return Promise.all(schedulePromises);
    }

    createTimeSlotsForPeriod(schedules, start, end) {
        console.log(schedules);
        var timePromises = [];
        const days = end.diff(start, 'days');
        for (var i = 0; i < days; i++) {
            const thisDay = moment(start).add(i, 'days')
            const formattedDate = thisDay.format(("YYYY-MM-DD"));
            const schedule = schedules.find((schedule) => moment(schedule.date).format('YYYY-MM-DD') == formattedDate);
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
        let values = [];
        if (slot_length_minutes > 0) {
            const numberOfSlots = lengthOfDayInMinutes / slot_length_minutes;
            for (var i = 0; i < numberOfSlots; i++) {
                const row_start_time = this.moment(`${formattedDate} ${dayStartTime}`).add(i * slot_length_minutes, 'minutes').format("HH:mm:ss");
                const row_end_time = this.moment(`${formattedDate} ${dayStartTime}`).add((i + 1) * slot_length_minutes, 'minutes').format("HH:mm:ss");
                const row = [formattedDate, row_start_time, row_end_time, available_count];
                values.push(row);
            }
            return this.pool.doQuery("insert ignore into time_slot (`date`, `start_time`, `end_time`, `available_count`) values ? on duplicate key update end_time = values(end_time)", [values]);
        } else {
            return Promise.resolve();
        }   
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
                if (values.length > 0) {
                    return this.pool.doQuery("insert ignore into car_slot (`time_slot_id`, `car_id`, `reserved`) values ?", [values]);
                } else {
                    return Promise.resolve();
                }
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