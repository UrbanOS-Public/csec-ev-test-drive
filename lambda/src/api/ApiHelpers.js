const extend = require('extend');

module.exports.httpResponse = (callback, statusCode, bodyObject, headers) => {
    const defaultHeaders = {
        'Access-Control-Allow-Origin': '*',
    };
    const headersToSend = extend(defaultHeaders, headers);

    callback(null, {
        statusCode: statusCode,
        body: JSON.stringify(bodyObject),
        headers: headersToSend,
    })
};