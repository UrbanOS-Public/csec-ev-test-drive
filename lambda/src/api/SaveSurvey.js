const moment = require('moment');
const {BetterSmartExperienceMySQLPool} = require('../utils/BetterSmartExperienceMySQLPool');
const ApiHelpers = require('./ApiHelpers');

const USER_NOT_FOUND = "Could not find user: ";

class SaveSurvey {
    constructor(pool, moment, ApiHelpers) {
        this.moment = moment;
        this.pool = pool;
        this.ApiHelpers = ApiHelpers;
    }

    handleEvent(event, context, callback) {
        const body = JSON.parse(event.body);
        const email = body.email;
        const confirmation_number = body.confirmationNumber;
        this.getUser(email)
            .then((userRows) => this.validateUser(userRows, email))
            .then((user) => this.saveUserResponse(user, confirmation_number, body))
            .then((insertForUserResponse) => this.saveUserResponseAnswers(insertForUserResponse, body))
            .then((data) => this.successHandler(callback, data), (error) => this.errorHandler(callback, error))
        ;
    }

    getUser(email) {
        return this.pool.doQuery("select * from user where email = ?", [email]);
    }

    validateUser(userRows, email) {
        if (userRows.length !== 1) {
            return Promise.reject(USER_NOT_FOUND + email);
        }
        return userRows[0];
    }

    saveUserResponse(user, confirmation_number, body) {
        const object = {
            user_id: user.id,
            survey_id: body.surveyId,
            confirmation_number: confirmation_number
        };
        return this.pool.doQuery("insert into user_response set ?", object);
    }

    saveUserResponseAnswers(insertForUserResponse, body) {
        const values = body.responses.map((response) => {
            return [insertForUserResponse.insertId, response.questionId, response.optionId, response.text];
        });
        console.log(values);
        return this.pool.doQuery("insert into user_response_answer (`user_response_id`, `survey_question_id`, `survey_question_option_id`, `text`) values ?", [values]);
    }

    successHandler(callback) {
        this.pool.end();
        console.log(`Done`);
        this.ApiHelpers.httpResponse(callback, 200, {message: "Success"});
    }

    errorHandler(callback, error) {
        this.pool.end();
        console.log(`ERROR: ${error}`);
        var errorToSend = 'An error occurred when processing your request.';
        if (error !== undefined && error.indexOf(USER_NOT_FOUND) === 0) {
            errorToSend = error;
        }
        this.ApiHelpers.httpResponse(callback, 500, {errors: errorToSend});
    }
}

exports.SaveSurvey = SaveSurvey;
exports.handler = (event, context, callback) => {
    const handler = new SaveSurvey(new BetterSmartExperienceMySQLPool(), moment, ApiHelpers);
    handler.handleEvent(event, context, callback);
};