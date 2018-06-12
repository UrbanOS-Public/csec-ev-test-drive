const extend = require('extend');

module.exports.httpResponse = (callback, statusCode, bodyObject, headers) => {
    var defaultHeaders = {
        'Access-Control-Allow-Origin': '*',
    };
    var headersToSend = extend(defaultHeaders, headers);

    callback(null, {
        statusCode: statusCode,
        body: JSON.stringify(bodyObject),
        headers: headersToSend,
    })
};