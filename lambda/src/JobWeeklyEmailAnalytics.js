const moment = require('moment');
const {BetterSmartExperienceMySQLPool} = require('./utils/BetterSmartExperienceMySQLPool');

class JobWeeklyEmailAnalytics {
    constructor(pool, moment) {
        this.pool = pool;
        this.moment = moment;
    }

    handleEvent(event, context, callback) {
        this.getCurrentCars()
            .then((data) => this.successHandler(callback, data), (err) => this.errorHandler(callback, err))
        ;
    }

    getCurrentCars() {
        const query = `
        select 
            ur.id, 
            u.*, 
            s.type as survey_type, 
            ura.text as optional_additional_text, 
            sq.text as question, 
            sqo.text as answer 
        from 
            user_response_answer ura, 
            user_response ur, 
            survey_question sq, 
            survey_question_option sqo, 
            survey s, 
            user u 
        where 
                ur.id = ura.user_response_id 
            and ura.survey_question_id = sq.id 
            and ura.survey_question_option_id = sqo.id 
            and ur.survey_id = s.id 
            and ur.user_id = u.id 
            and ur.id = 2000099
        `;


        return this.pool.doQuery(query, []);
    }

    successHandler(callback, data) {
        this.pool.end();
        console.log(`Done`);
        callback(null, data);
    }

    errorHandler(callback, error) {
        this.pool.end();
        console.log(`ERROR: ${error}`);
        callback(error);
    }
}

exports.JobWeeklyEmailAnalytics = JobWeeklyEmailAnalytics;
exports.handler = (event, context, callback) => {
    const jobPopulateCarSchedule = new JobWeeklyEmailAnalytics(new BetterSmartExperienceMySQLPool(), moment);
    jobPopulateCarSchedule.handleEvent(event, context, callback);
};