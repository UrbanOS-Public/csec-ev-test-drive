const {JobPopulateTimeSlots} = require('../src/JobPopulateTimeSlots');
const chai = require('chai');
const expect = chai.expect;
const {prepare} = require('ndc-util');
const moment = require('moment');

const {BetterSmartExperienceMySQLPool} = require('../src/utils/BetterSmartExperienceMySQLPool');


describe('JobPopulateTimeSlots', () => {

    let handler;
    let pool;
    const yesterday = moment().subtract(1, 'days').format("YYYY-MM-DD");
    const today = moment().format("YYYY-MM-DD");
    const tomorrow = moment().add(1, 'days').format("YYYY-MM-DD");
    const dayOfTheWeekStartingSundayZeroBased = moment().day();

    beforeEach(() => {
        process.env.host = 'localhost';
        process.env.user = 'root';
        process.env.password = '';
        pool = new BetterSmartExperienceMySQLPool();

        handler = prepare(new JobPopulateTimeSlots(pool, moment), 'handleEvent')
            .withArgs({}, context);
    });

    after(() => {
        setTimeout(() => {
            console.log(`closing pool`);
            pool.end();
        }, 1000);
        setTimeout(() => {
            //TODO: IDK why but the test hangs without this.
            process.exit();
        }, 1500);
    });

    it('archive car slots for yesterday', () => {
        cleanseDb();
        populateDb();


        return handler
            .assert(() => {
                return new Promise((resolve) => {
                    pool = new BetterSmartExperienceMySQLPool();
                    pool.doQuery("select * from archive_car_slot", [])
                        .then((data) => {
                            expect(data[0].time_slot_id).to.equal(500000);
                            resolve(data);
                        });
                });
            });
    });

    it('delete car slots for yesterday', () => {
        cleanseDb();
        populateDb();

        return handler
            .assert(() => {
                return new Promise((resolve, reject) => {
                    pool = new BetterSmartExperienceMySQLPool();
                    pool.doQuery("select cs.* from car_slot cs, time_slot ts where cs.time_slot_id = ts.id and ts.date = ?", [yesterday])
                        .then((data) => {
                            expect(data.length).to.equal(0);
                            resolve(data);
                        })
                        .catch(err => {
                            reject(err);
                        });
                });
            });
    });

    it('archive time slots for yesterday', () => {
        cleanseDb();
        populateDb();

        return handler
            .assert(() => {
                return new Promise((resolve) => {
                    pool = new BetterSmartExperienceMySQLPool();
                    pool.doQuery("select * from archive_time_slot", [])
                        .then((data) => {
                            expect(data[0].id).to.equal(500000);
                            resolve(data);
                        });
                });
            });
    });

    it('delete time slots for yesterday', () => {
        cleanseDb();
        populateDb();

        return handler
            .assert(() => {
                return new Promise((resolve) => {
                    pool = new BetterSmartExperienceMySQLPool();
                    pool.doQuery("select * from time_slot where date = ?", [yesterday])
                        .then((data) => {
                            expect(data.length).to.equal(0);
                            resolve(data);
                        });
                });
            });
    });

    it('should insert time slots for today', () => {
        var p1 = cleanseDb();
        var p2 = populateDb();

        return Promise.all([p1, p2])
            .then(() => {
                return handler
                    .assert(() => {
                        return new Promise((resolve) => {
                            pool = new BetterSmartExperienceMySQLPool();
                            pool.doQuery("select * from time_slot where date = ? order by start_time asc", [today])
                                .then((data) => {
                                    expect(data.length).to.equal(20);
                                    expect(data[0].start_time).to.equal("10:00:00");
                                    expect(data[0].end_time).to.equal("10:30:00");
                                    expect(data[1].available_count).to.equal(2);
                                    expect(data[1].start_time).to.equal("10:30:00");
                                    expect(data[2].start_time).to.equal("11:00:00");
                                    expect(data[3].start_time).to.equal("11:30:00");
                                    expect(data[4].start_time).to.equal("12:00:00");
                                    expect(data[5].start_time).to.equal("12:30:00");
                                    expect(data[6].start_time).to.equal("13:00:00");
                                    resolve(data);
                                });
                        });
                    });
            });
    });

    it('should use schedule end_time', () => {
        var p1 = cleanseDb();
        var p2 = populateDb();

        return Promise.all([p1, p2])
            .then(() => {
                pool.doQuery("update schedule set end_time = '21:00' where day_of_the_week = ?", dayOfTheWeekStartingSundayZeroBased);

                return handler
                    .assert(() => {
                        return new Promise((resolve) => {
                            pool = new BetterSmartExperienceMySQLPool();
                            pool.doQuery("select * from time_slot where date = ? order by start_time asc", [today])
                                .then((data) => {
                                    expect(data.length).to.equal(22);
                                    resolve(data);
                                });
                        });
                    });
            });
    });

    it('should use length', () => {
        const p1 = cleanseDb();
        const p2 = populateDb();
        const p3 = pool.doQuery("update schedule set slot_length_minutes = 15 where day_of_the_week = ?", dayOfTheWeekStartingSundayZeroBased);

        return Promise.all([p1, p2, p3])
            .then(() => {
                return handler
                    .assert(() => {
                        return new Promise((resolve) => {
                            pool = new BetterSmartExperienceMySQLPool();
                            pool.doQuery("select * from time_slot where date = ? order by start_time asc", [today])
                                .then((data) => {
                                    expect(data.length).to.equal(40);
                                    resolve(data);
                                });
                        });
                    });
            });
    });

    it('should populate car slots for active cars', () => {
        var p1 = cleanseDb();
        var p2 = populateDb();

        return Promise.all([p1, p2])
            .then(() => {
                return handler
                    .assert(() => {
                        return new Promise((resolve) => {
                            pool = new BetterSmartExperienceMySQLPool();
                            pool.doQuery("select cs.* from car_slot cs, time_slot ts where cs.time_slot_id = ts.id and ts.date = ?", [today])
                                .then((data) => {
                                    expect(data.length).to.equal(80);
                                    resolve(data);
                                });
                        });
                    });
            });
    });

    it('should use schedule_exception if exists for today', () => {
        const p1 = cleanseDb();
        const p2 = populateDb();
        const values = [
            [dayOfTheWeekStartingSundayZeroBased, today, '10:00', '11:00', 15, 3]
        ];
        const p3 = pool.doQuery("insert into schedule_exception (`day_of_the_week`, `date`, `start_time`, `end_time`, `slot_length_minutes`, `employees_per_slot`) values ?", [values]);

        return Promise.all([p1, p2, p3])
            .then(() => {
                return handler
                    .assert(() => {
                        return new Promise((resolve) => {
                            pool = new BetterSmartExperienceMySQLPool();
                            pool.doQuery("select * from time_slot where date = ? order by start_time asc", [today])
                                .then((data) => {
                                    expect(data.length).to.equal(4);
                                    resolve(data);
                                });
                        });
                    });
            });
    });


    let populateDb = () => {
        const carSchedules = [
            [1, today, true],
            [2, today, true],
            [3, today, true],
            [4, today, true],
            [5, today, false],
            [6, today, false]
        ];
        const queries = [
            ["insert ignore into time_slot (`id`, `date`, `start_time`, `end_time`, `available_count`) values (500000, ?, '10:00', '10:30', 1)", [yesterday]],
            ["insert ignore into time_slot (`id`, `date`, `start_time`, `end_time`, `available_count`) values (500001, ?, '10:00', '10:30', 1)", [today]],
            ["insert ignore into time_slot (`id`, `date`, `start_time`, `end_time`, `available_count`) values (500002, ?, '10:00', '10:30', 1)", [tomorrow]],

            ["insert ignore into car_slot (`time_slot_id`, `car_id`, `reserved`) values (500000, 1, false)", []],
            ["insert ignore into car_slot (`time_slot_id`, `car_id`, `reserved`) values (500001, 1, false)", []],
            ["insert ignore into car_slot (`time_slot_id`, `car_id`, `reserved`) values (500002, 1, false)", []],
            ["update schedule set end_time = '20:00', slot_length_minutes = 30, employees_per_slot = 2 where day_of_the_week = ?", dayOfTheWeekStartingSundayZeroBased],
            ["insert ignore into car_schedule (`car_id`, `date`, `active`) values ?", [carSchedules]]

        ];
        const promises = queries.map((queryData) => {
            return pool.doQuery(queryData[0], queryData[1]);
        });
        return Promise.all(promises);
    };

    let cleanseDb = () => {
        const queries = [
            'delete from car_slot',
            'delete from schedule_exception',
            'delete from archive_time_slot',
            'delete from archive_car_schedule',
            'delete from archive_car_slot',
            'delete from time_slot',
        ];
        const promises = queries.map((query) => {
            return pool.doQuery(query, []);
        });
        return Promise.all(promises);
    };

});