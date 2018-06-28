const apiHelpers = require('./ApiHelpers');

class TestingAuth {
    constructor(apiHelpers) {
        this.apiHelpers = apiHelpers;
    }

    handleEvent(event, context, callback) {
        console.log(`>>>>HERE!!!`);
        console.log(event);
        this.apiHelpers.httpResponse(callback, 200, {message: "Success"});
    }
}

exports.TestingAuth = TestingAuth;
exports.handler = (event, context, callback) => {
    const handler = new TestingAuth(apiHelpers);
    handler.handleEvent(event, context, callback);
};