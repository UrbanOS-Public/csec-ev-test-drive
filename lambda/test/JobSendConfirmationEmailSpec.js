const {JobSendConfirmationEmail} = require('../src/JobSendConfirmationEmail');
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const expect = chai.expect;
const {prepare} = require('ndc-util');
const moment = require('moment');
var rk = require('randomkey');

const {BetterSmartExperienceMySQLPool} = require('../src/utils/BetterSmartExperienceMySQLPool');


describe('JobSendConfirmationEmail', () => {

    let sandbox = sinon.createSandbox();
    let handler;
    let pool;
    let mockedSES;
    let sesResponseJson = {id: "123"};

    beforeEach(() => {
        process.env.host = 'localhost';
        process.env.user = 'root';
        process.env.password = '';
        process.env.email = 'no-reply@drivesmartcbus.com';
        pool = new BetterSmartExperienceMySQLPool();
        mockedSES = {
            sendTemplatedEmail: sandbox.stub()
        };


        mockedSES.sendTemplatedEmail.returns({
            promise: () => Promise.resolve(sesResponseJson)
        });

        handler = prepare(new JobSendConfirmationEmail(pool, moment, mockedSES), 'handleEvent')
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

    it('send email', () => {
        return setupDB()
            .then(() => {
                return handler
                    .assert(() => {
                        return new Promise((resolve) => {
                            const TemplateData = {
                                confirmation_number: "JO10",
                                formatted_drive_time: "March 1, 2018 10:00am",
                                vehicle: "BMW i3",
                                msrp: "$44,450"
                            };
                            const expectedParams = {
                                Destination: {
                                    ToAddresses: [
                                        "jolson@pillartechnology.com"
                                    ]
                                },
                                Source: 'EV Test Drive <no-reply@drivesmartcbus.com>',
                                Template: 'ConfirmationTemplate',
                                ConfigurationSetName: 'DefaultConfigurationSet',
                                TemplateData: JSON.stringify(TemplateData),
                                ReplyToAddresses: [
                                    "no-reply@drivesmartcbus.com"
                                ],
                                ReturnPath: "no-reply@drivesmartcbus.com"
                            };
                            expect(mockedSES.sendTemplatedEmail).to.have.been.calledWith(expectedParams);
                            expect(mockedSES.sendTemplatedEmail).to.have.been.calledOnce;
                            resolve("DONE");
                        });
                    });
            });
    });

    it('mark row as emailed', () => {
        return setupDB()
            .then(() => {
                return handler
                    .assert(() => {
                        return new Promise((resolve) => {
                            pool = new BetterSmartExperienceMySQLPool();
                            pool.doQuery("select * from user_drive_map", [])
                                .then((data) => {
                                    const row = data[0];
                                    expect(row.email_sent).to.equal(1);
                                    expect(row.email_data).to.equal(JSON.stringify(sesResponseJson));
                                    resolve(data);
                                });
                        });
                    });
            });
    });

    it('mark row as emailed even when an error occurs so we do not keep trying to email the same person', () => {
        const message = rk(1100);
        const expectedMessage = message.slice(0, 1000);
        console.log(message);
        mockedSES.sendTemplatedEmail.returns({
            promise: () => Promise.reject({message: message})
        });

        return setupDB()
            .then(() => {
                return handler
                    .assert(() => {
                        return new Promise((resolve) => {
                            pool = new BetterSmartExperienceMySQLPool();
                            pool.doQuery("select * from user_drive_map", [])
                                .then((data) => {
                                    const row = data[0];
                                    expect(row.email_sent).to.equal(1);
                                    expect(row.email_data).to.equal(expectedMessage);
                                    resolve(data);
                                });
                        });
                    });
            });
    });

    it('should not send email when no emails to send', () => {
        return setupDB(["update user_drive_map set email_sent = 1"])
            .then(() => {
                return handler
                    .assert(() => {
                        return new Promise((resolve) => {
                            expect(mockedSES.sendTemplatedEmail).not.to.have.been.called;
                            resolve("DONE");
                        });
                    });
            });
    });

    let setupDB = (additionalQueries) => {
        var promises = [];
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
            ["insert ignore into user (`id`, `email`, `first_name`, `last_name`, `phone`, `zipcode`) values (99, 'jolson@pillartechnology.com', 'Jarred', 'Olson', 'stuff', '12345')", []],
            ["insert ignore into drive (`id`, `car_id`, `date`, `scheduled_start_time`, `scheduled_end_time`) values (10, 1, '2018-03-01', '10:00:00', '10:30:00')", []],
            ["insert ignore into user_drive_map (`user_id`, `drive_id`, `role`, `confirmation_number`) values (99, 10, 'DRIVER', 'JO10')", []]
        ];
        const promises = queries.map((queryData) => {
            return pool.doQuery(queryData[0], queryData[1]);
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
            return pool.doQuery(query, []);
        });
        return Promise.all(promises);
    };
});