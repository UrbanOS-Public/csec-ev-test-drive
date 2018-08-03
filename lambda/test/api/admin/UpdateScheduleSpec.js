const {UpdateSchedule} = require('../../../src/api/admin/UpdateSchedule');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const expect = chai.expect;
const {prepare} = require('ndc-util');
const moment = require('moment');
const ApiHelpers = require('../../../src/api/ApiHelpers');
const {BetterSmartExperienceMySQLPool} = require('../../../src/utils/BetterSmartExperienceMySQLPool');

describe('UpdateSchedule', () => {

    let handler;
    let pool;

    beforeEach(() => {
        process.env.host = 'localhost';
        process.env.user = 'root';
        process.env.password = '';
        pool = new BetterSmartExperienceMySQLPool();

        const event = {
            body: JSON.stringify(
                {
                    id: 1,
                    start_time: "10:00 am",
                    end_time: "5:00 pm",
                    slot_length_minutes: 15,
                    employees_per_slot: 3,
                    day_of_the_week: 5
                }
            )
        };

        handler = prepare(new UpdateSchedule(pool, moment, ApiHelpers), 'handleEvent')
            .withArgs(event, context);
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

    it('should return 400 with empty event', () => {
        const event = {};

        handler = prepare(new UpdateSchedule(pool, moment, ApiHelpers), 'handleEvent')
            .withArgs(event, context);

        return handler.assert((response) => {
            expect(response.statusCode).to.equal(400);
        });
    });

    it('should return 400 with invalid JSON body', () => {
        const event = {body: 'not cool'};

        handler = prepare(new UpdateSchedule(pool, moment, ApiHelpers), 'handleEvent')
            .withArgs(event, context);

        return handler.assert((response) => {
            expect(response.statusCode).to.equal(400);
        });
    });

    it('should return 400 with invalid with error message of missing required fields', () => {
        const event = {body: JSON.stringify({})};

        handler = prepare(new UpdateSchedule(pool, moment, ApiHelpers), 'handleEvent')
            .withArgs(event, context);

        return handler.assert((response) => {
            expect(response.statusCode).to.equal(400);
            expect(JSON.parse(response.body).error).to.equal('Missing required fields id, start_time, end_time, slot_length_minutes, employees_per_slot');
        });
    });

    it('should update schedule', () => {
        return setupDB()
            .then(() => {
                return handler
                    .assert(() => {
                        return new Promise((resolve) => {
                            pool = new BetterSmartExperienceMySQLPool();
                            pool.doQueryFirstRow("select * from schedule where id = 1")
                                .then((row) => {
                                    expect(row.day_of_the_week).to.equal(0);
                                    expect(row.start_time).to.equal('10:00:00');
                                    expect(row.end_time).to.equal('17:00:00');
                                    expect(row.slot_length_minutes).to.equal(15);
                                    expect(row.employees_per_slot).to.equal(3);
                                    resolve(row);
                                });
                        });
                    })
            })
    });

    it('should not update day_of_the_week if supplied', () => {
        return setupDB()
            .then(() => {
                return handler
                    .assert(() => {
                        return new Promise((resolve) => {
                            pool = new BetterSmartExperienceMySQLPool();
                            pool.doQueryFirstRow("select * from schedule where id = 1")
                                .then((row) => {
                                    expect(row.day_of_the_week).to.equal(0);
                                    resolve(row);
                                });
                        });
                    })
            })
    });

    it('should return success message', () => {
        return setupDB()
            .then(() => {
                return handler
                    .assert((response) => {
                        expect(response.statusCode).to.equal(200);
                        expect(JSON.parse(response.body).message).to.equal("Successfully updated schedule");
                    })
            })
    });


    let setupDB = (additionalQueries) => {
        let promises = [];
        promises.push(cleanseDb());
        promises.push(populateDb());
        if (additionalQueries && additionalQueries.length > 0) {
            const p3 = additionalQueries.map((query) => {
                return pool.doQuery(query, []);
            });
            promises.push(p3);
        }

        return Promise.all(promises);
    };

    let populateDb = () => {
        const queries = [
            ["insert ignore into schedule (`id`, `day_of_the_week`, `start_time`, `end_time`, `slot_length_minutes`, `employees_per_slot`) values (1, 0, '09:00', '18:00', 30, 2)", []],
        ];
        const promises = queries.map((queryData) => {
            return pool.doQuery(queryData[0], queryData[1]);
        });
        return Promise.all(promises);
    };

    let cleanseDb = () => {
        const queries = [
            'delete from schedule where id = 1',
        ];
        const promises = queries.map((query) => {
            return pool.doQuery(query, []);
        });
        return Promise.all(promises);
    };


});