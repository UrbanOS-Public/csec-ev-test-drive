const {GetUser} = require('../../src/api/GetUser');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const expect = chai.expect;
const {prepare} = require('ndc-util');
const moment = require('moment');
const ApiHelpers = require('../../src/api/ApiHelpers');
const {BetterSmartExperienceMySQLPool} = require('../../src/utils/BetterSmartExperienceMySQLPool');

describe('GetUser', () => {

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

    it('should error when no queryStringParameters', () => {
        handler = prepare(new GetUser(pool, moment, ApiHelpers), 'handleEvent')
            .withArgs({queryStringParameters: null}, context);


        return handler
            .assert((response) => {
                expect(response.statusCode).to.equal(400);
                expect(response.body).to.equal(JSON.stringify({message: "Email or Confirmation Number is required"}));
            });
    });

    it('should error when no email or Confirmation Number supplied', () => {
        handler = prepare(new GetUser(pool, moment, ApiHelpers), 'handleEvent')
            .withArgs({queryStringParameters: {}}, context);


        return handler
            .assert((response) => {
                expect(response.statusCode).to.equal(400);
                expect(response.body).to.equal(JSON.stringify({message: "Email or Confirmation Number is required"}));
            });
    });

    it('should return empty array when email not found', () => {
        handler = prepare(new GetUser(pool, moment, ApiHelpers), 'handleEvent')
            .withArgs({queryStringParameters: {email: "bad@bad"}}, context);


        return handler
            .assert((response) => {
                expect(response.statusCode).to.equal(404);
                expect(response.body).to.equal(JSON.stringify({message: "User not found"}));
            });
    });

    it('should return id and email when user found', () => {
        setupDB();
        handler = prepare(new GetUser(pool, moment, ApiHelpers), 'handleEvent')
            .withArgs({queryStringParameters: {email: "jolson@pillartechnology.com"}}, context);


        return handler
            .assert((response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.equal(JSON.stringify({id: 99, email: "jolson@pillartechnology.com"}));
            });
    });

    it('should return id and email when user found by confirmation number', () => {
        setupDB();
        handler = prepare(new GetUser(pool, moment, ApiHelpers), 'handleEvent')
            .withArgs({queryStringParameters: {confirmationNumber: "JO10"}}, context);


        return handler
            .assert((response) => {
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.equal(JSON.stringify({id: 99, email: "jolson@pillartechnology.com"}));
            });
    });



    let setupDB = (additionalQueries) => {
        var promises = [];
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
        const queries = [
            ["insert ignore into user (`id`, `email`, `first_name`, `last_name`, `phone`, `zipcode`) values (99, 'jolson@pillartechnology.com', 'Jarred', 'Olson', 'stuff', '12345')", []],
            ["insert ignore into drive (`id`, `car_id`, `date`, `scheduled_start_time`, `scheduled_end_time`) values (10, 1, '2018-03-01', '10:00:00', '10:30:00')", []],
            ["insert ignore into user_drive_map (`user_id`, `drive_id`, `role`, `confirmation_number`) values (99, 10, 'DRIVER', 'JO10')", []]
        ];
        const promises = queries.map((queryData) => {
            return doQuery(queryData[0], queryData[1]);
        });
        return Promise.all(promises);
    };

    let cleanseDb = () => {
        const stupidQueryToAddEnoughTimeForPreviousStatementToFinishForNextOneToWork = "select 1 from dual";
        const queries = [
            'delete from user_drive_map',
            stupidQueryToAddEnoughTimeForPreviousStatementToFinishForNextOneToWork,
            'delete from drive',
            stupidQueryToAddEnoughTimeForPreviousStatementToFinishForNextOneToWork,
            'delete from user where id = 99',
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