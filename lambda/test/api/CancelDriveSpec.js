const {CancelDrive} = require('../../src/api/CancelDrive');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const expect = chai.expect;
const {prepare} = require('ndc-util');
const moment = require('moment');
const ApiHelpers = require('../../src/api/ApiHelpers');
const {BetterSmartExperienceMySQLPool} = require('../../src/utils/BetterSmartExperienceMySQLPool');

const CONFIRMATION_NUMBER = 'JO10';
const TIME_SLOT_ID = 401010;
const stupidQueryToAddEnoughTimeForPreviousStatementToFinishForNextOneToWork = "select 1 from dual";

describe('CancelDrive', () => {

    let handler;
    let pool;

    beforeEach(() => {
        process.env.host = 'localhost';
        process.env.user = 'root';
        process.env.password = '';
        pool = new BetterSmartExperienceMySQLPool();
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

    it('should return 404 when body is empty', () => {
        handler = prepare(new CancelDrive(pool, moment, ApiHelpers), 'handleEvent')
            .withArgs({}, context);


        return handler
            .assert((response) => {
                expect(response.statusCode).to.equal(404);
            });
    });

    it('should return 404 when pin is not present', () => {
        handler = prepare(new CancelDrive(pool, moment, ApiHelpers), 'handleEvent')
            .withArgs({body: JSON.stringify({})}, context);


        return handler
            .assert((response) => {
                expect(response.statusCode).to.equal(404);
            });
    });

    it('should return 404 when pin is incorrect', () => {
        handler = prepare(new CancelDrive(pool, moment, ApiHelpers), 'handleEvent')
            .withArgs({body: JSON.stringify({pin: "1234"})}, context);


        return handler
            .assert((response) => {
                expect(response.statusCode).to.equal(404);
            });
    });

    it('should delete drive and user_drive_map when found by confirmation number', () => {
        setupDB();
        handler = prepare(new CancelDrive(pool, moment, ApiHelpers), 'handleEvent')
            .withArgs({body: JSON.stringify({pin: "17043215", confirmationNumber: CONFIRMATION_NUMBER})}, context);

        return handler
            .assert((response) => {
                expect(response.statusCode).to.equal(200);
                return new Promise((resolve, reject) => {
                    pool = new BetterSmartExperienceMySQLPool();
                    pool.doQuery("select * from user_drive_map where confirmation_number = ?", [CONFIRMATION_NUMBER])
                        .then((data) => {
                            expect(data.length).to.equal(0);
                            resolve(data);
                        });
                });
            })
    });

    it('should increment available_count on time_slot', () => {
        setupDB();
        handler = prepare(new CancelDrive(pool, moment, ApiHelpers), 'handleEvent')
            .withArgs({body: JSON.stringify({pin: "17043215", confirmationNumber: CONFIRMATION_NUMBER})}, context);

        return handler
            .assert((response) => {
                expect(response.statusCode).to.equal(200);
                return new Promise((resolve) => {
                    pool = new BetterSmartExperienceMySQLPool();
                    pool.doQueryFirstRow("select * from time_slot where id = ?", [TIME_SLOT_ID])
                        .then((row) => {
                            expect(row.available_count).to.equal(2);
                            resolve(row);
                        });
                });
            })
    });

    it('should set car as available', () => {
        setupDB();
        handler = prepare(new CancelDrive(pool, moment, ApiHelpers), 'handleEvent')
            .withArgs({body: JSON.stringify({pin: "17043215", confirmationNumber: CONFIRMATION_NUMBER})}, context);

        return handler
            .assert((response) => {
                expect(response.statusCode).to.equal(200);
                return new Promise((resolve) => {
                    pool = new BetterSmartExperienceMySQLPool();
                    pool.doQuery("select * from car_slot where time_slot_id = ? and reserved = 0", [TIME_SLOT_ID])
                        .then((rows) => {
                            expect(rows.length).to.equal(1);
                            resolve(rows);
                        });
                });
            })
    });


    it('should handle user_drive_map not existing', () => {
        setupDB([`delete from user_drive_map`]);
        handler = prepare(new CancelDrive(pool, moment, ApiHelpers), 'handleEvent')
            .withArgs({body: JSON.stringify({pin: "17043215", confirmationNumber: CONFIRMATION_NUMBER})}, context);

        return handler
            .assert((response) => {
                expect(response.statusCode).to.equal(500);
            })
    });

    it('should handle drive not existing', () => {
        setupDB([`delete from user_drive_map`, `delete from drive`]);
        handler = prepare(new CancelDrive(pool, moment, ApiHelpers), 'handleEvent')
            .withArgs({body: JSON.stringify({pin: "17043215", confirmationNumber: CONFIRMATION_NUMBER})}, context);

        return handler
            .assert((response) => {
                expect(response.statusCode).to.equal(500);
            })
    });

    it('should handle car_slot not existing', () => {
        setupDB([`delete from car_slot where time_slot_id = ${TIME_SLOT_ID}`]);
        handler = prepare(new CancelDrive(pool, moment, ApiHelpers), 'handleEvent')
            .withArgs({body: JSON.stringify({pin: "17043215", confirmationNumber: CONFIRMATION_NUMBER})}, context);

        return handler
            .assert((response) => {
                expect(response.statusCode).to.equal(200);
            })
    });

    it('should handle time_slot not existing', () => {
        const extraQueries = [
            `delete from car_slot where time_slot_id = ${TIME_SLOT_ID}`,
            stupidQueryToAddEnoughTimeForPreviousStatementToFinishForNextOneToWork,
            `delete from time_slot where id = ${TIME_SLOT_ID}`
        ];
        setupDB(extraQueries);
        handler = prepare(new CancelDrive(pool, moment, ApiHelpers), 'handleEvent')
            .withArgs({body: JSON.stringify({pin: "17043215", confirmationNumber: CONFIRMATION_NUMBER})}, context);

        return handler
            .assert((response) => {
                expect(response.statusCode).to.equal(200);
            })
    });


    let setupDB = (additionalQueries) => {
        let promises = [];
        promises.push(cleanseDb());
        promises.push(populateDb());
        if (additionalQueries && additionalQueries.length > 0) {
            const p3 = additionalQueries.map((query) => {
                return doQuery(query, []);
            });
            promises.push(p3);
        }

        return Promise.all(promises);
    };

    let populateDb = () => {
        const date = '2018-03-01';
        const start_time = '10:00:00';
        const queries = [
            ["insert ignore into user (`id`, `email`, `first_name`, `last_name`, `phone`, `zipcode`) values (99, 'jolson@pillartechnology.com', 'Jarred', 'Olson', 'stuff', '12345')", []],
            ["insert ignore into drive (`id`, `car_id`, `date`, `scheduled_start_time`, `scheduled_end_time`) values (10, 1, ?, '10:00:00', '10:30:00')", [date]],
            ["insert ignore into user_drive_map (`user_id`, `drive_id`, `role`, `confirmation_number`) values (99, 10, 'DRIVER', ?)", [CONFIRMATION_NUMBER]],
            ["insert ignore into time_slot (`id`, `date`, `start_time`, `end_time`, `available_count`) values (?, ?, ?, '10:30', 1)", [TIME_SLOT_ID, date, start_time]],
            ["insert ignore into car_slot (`id`, `time_slot_id`, `car_id`, `reserved`) values (?, ?, 1, true)", [70000, TIME_SLOT_ID]],
            ["insert ignore into car_slot (`id`, `time_slot_id`, `car_id`, `reserved`) values (?, ?, 2, true)", [70001, TIME_SLOT_ID]],
        ];
        const promises = queries.map((queryData) => {
            return doQuery(queryData[0], queryData[1]);
        });
        return Promise.all(promises);
    };

    let cleanseDb = () => {
        const queries = [
            'delete from user_drive_map',
            `delete from car_slot where time_slot_id = ${TIME_SLOT_ID}`,
            stupidQueryToAddEnoughTimeForPreviousStatementToFinishForNextOneToWork,
            'delete from drive',
            stupidQueryToAddEnoughTimeForPreviousStatementToFinishForNextOneToWork,
            'delete from user where id = 99',
            `delete from time_slot where id = ${TIME_SLOT_ID}`
        ];
        const promises = queries.map((query) => {
            return doQuery(query, []);
        });
        return Promise.all(promises);
    };

    let doQuery = (query, params) => {
        return pool.doQuery(query, params);
    }
});