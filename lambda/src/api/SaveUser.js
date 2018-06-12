const moment = require('moment');
const smartExperienceMySQLPool = require('../utils/SmartExperienceMySQLPool');
const ApiHelpers = require('./ApiHelpers');

class SaveUser {
    constructor(moment, smartExperienceMySQLPool, ApiHelpers) {
        this.moment = moment;
        this.smartExperienceMySQLPool = smartExperienceMySQLPool;
        this.ApiHelpers = ApiHelpers;
    }

    handleEvent(event, context, callback) {
        console.log(`>>>>> HERE`);
        console.log(event.body);
        console.log();
        const body = JSON.parse(event.body);
        this.ApiHelpers.httpResponse(callback, 200, {});
    }
}

exports.ApiSaveUser = SaveUser;
exports.handler = (event, context, callback) => {
    const handler = new SaveUser(moment, smartExperienceMySQLPool, ApiHelpers);
    handler.handleEvent(event, context, callback);
};