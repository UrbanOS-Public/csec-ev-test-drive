const {JobPopulateTimeSlots} = require('../src/JobPopulateTimeSlots');
const chai = require('chai');
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const expect = chai.expect;
const {prepare} = require('ndc-util');
const moment = require('moment');

const {BetterSmartExperienceMySQLPool} = require('../src/utils/BetterSmartExperienceMySQLPool');

describe('JobPopulateTimeSlots', () => {
    let lambda;
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

        lambda = new JobPopulateTimeSlots(pool, moment);
    });

    after(() => {
        setTimeout(() => {
            console.log(`closing pool`);
        }, 1000);
        setTimeout(() => {
            //TODO: IDK why but the test hangs without this.
            process.exit();
        }, 1500);
    });

    describe('createTimeSlotsForPeriod', () => {
        it('should insert new timeslots for each day in a given period', () => {
            lambda.createTimeSlotsForDate = sinon.spy();
            lambda.createTimeSlotsForPeriod({}, moment(), moment().add(14, 'days'));

            sinon.assert.callCount(lambda.createTimeSlotsForDate, 14);
        });
    })

    describe('createCarSlotsForPeriod', () => {
        it('should insert new carslots for each day in a given period', () => {
            lambda.createCarSlotsForDate = sinon.spy();
            lambda.createCarSlotsForPeriod(moment(), moment().add(14, 'days'));
            
            sinon.assert.callCount(lambda.createCarSlotsForDate, 14);
        });
    })
});