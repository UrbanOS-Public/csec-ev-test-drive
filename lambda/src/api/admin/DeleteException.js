const {BetterSmartExperienceMySQLPool} = require("../../utils/BetterSmartExperienceMySQLPool");
const moment = require('moment');
const ApiHelpers = require('../ApiHelpers');

class DeleteException {
    constructor(pool, moment, ApiHelpers) {
        this.pool = pool;
        this.moment = moment;
        this.ApiHelpers = ApiHelpers;
    }

    handleEvent(event, context, callback) {
        const body = JSON.parse(event.body);
        const {pin, id} = body;

        if ("17043215" !== pin) {
            return this.ApiHelpers.httpResponse(callback, 404);
        }
        
        this.deleteException(id)
            .then((data) => this.successHandler(callback, data), (err) => this.errorHandler(callback, err))
        ;
    }

    deleteException(id) {
        const query = `
            delete from schedule_exception where id = ?
        `
        return this.pool.doQuery(query, [id]);
    }

    successHandler(callback, data) {
        this.pool.end();
        console.log('Query Result: ', data);
        console.log(`Done`);
        this.ApiHelpers.httpResponse(callback, 200, {message: "Successfully deleted the exception"});
    }

    errorHandler(callback, error) {
        this.pool.end();
        console.log(`ERROR: ${error}`);
        if (error.statusCode !== undefined) {
            this.ApiHelpers.httpResponse(callback, error.statusCode, {error: error.error});
        }
        this.ApiHelpers.httpResponse(callback, 500, {error: 'An error occurred when processing your request.'});
    }
}

exports.DeleteException = DeleteException;
exports.handler = (event, context, callback) => {
    const handler = new DeleteException(new BetterSmartExperienceMySQLPool(), moment, ApiHelpers);
    handler.handleEvent(event, context, callback);
};