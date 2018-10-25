const extend = require('extend');

class GetSurvey {
    constructor(pool, moment, ApiHelpers, surveyType) {
        this.moment = moment;
        this.pool = pool;
        this.ApiHelpers = ApiHelpers;
        this.surveyType = surveyType;
    }

    handleEvent(event, context, callback) {
        const today = this.moment().format("YYYY-MM-DD");
        this.getSurvey(today, this.surveyType)
            .then((rows) => this.getAllOtherData(rows[0]))
            .then((promiseResults) => this.transformData(promiseResults))
            .then((transformedData) => this.successHandler(callback, transformedData), (error) => this.errorHandler(callback, error))
        ;
    }

    getSurvey(date, surveyType) {
        return this.pool.doQuery("select * from survey where date_active <= ? and type = ? order by date_active desc limit 1", [date, surveyType]);
    }

    getAllOtherData(survey) {
        const surveyQuestionGroupsPromise = this.getSurveyQuestionGroups(survey.id);
        const surveyQuestionsPromise = this.getSurveyQuestions(survey.id);
        const surveyQuestionOptionsPromise = this.getSurveyQuestionOptions(survey.id);

        return Promise.all([survey, surveyQuestionGroupsPromise, surveyQuestionsPromise, surveyQuestionOptionsPromise])
    }

    getSurveyQuestionGroups(surveyId) {
        return this.pool.doQuery("select sqg.* from survey_question_group sqg where sqg.survey_id = ? order by sqg.order_index asc", surveyId);
    }

    getSurveyQuestions(surveyId) {
        return this.pool.doQuery("select sq.* from survey_question_group sqg, survey_question sq where sqg.id = sq.survey_question_group_id and sqg.survey_id = ?", surveyId);
    }

    getSurveyQuestionOptions(surveyId) {
        return this.pool.doQuery("select sqo.* from survey_question_group sqg, survey_question sq, survey_question_option sqo where sqg.id = sq.survey_question_group_id and sq.id = sqo.survey_question_id and sqg.survey_id = ?", surveyId);
    }

    transformData(promiseResults) {
        const survey = promiseResults[0];
        const surveyQuestionGroups = promiseResults[1];
        const surveyQuestions = promiseResults[2];
        const surveyQuestionOptions = promiseResults[3];

        //sort((a, b) => {
            // a.order_index - b.order_index
        // })
        const question_groups = surveyQuestionGroups.map((surveyQuestionGroup) => {
            const surveyQuestionsForGroup = surveyQuestions.filter((surveyQuestion) => {
                return surveyQuestion.survey_question_group_id === surveyQuestionGroup.id;
            }).map((surveyQuestion) => {
                const surveyQuestionOptionsForQuestion = surveyQuestionOptions.filter((surveyQuestionOption) => {
                    return surveyQuestionOption.survey_question_id === surveyQuestion.id;
                }).sort((a, b) => {
                     return a.order_index - b.order_index
                });
                return extend({}, surveyQuestion, {surveyQuestionOptions: surveyQuestionOptionsForQuestion});
            });

            return extend({}, surveyQuestionGroup, {surveyQuestions: surveyQuestionsForGroup});
        });

        const data = {
            id: survey.id,
            type: survey.type,
            dateCreated: survey.date_created,
            dateActive: survey.date_active,
            question_groups: question_groups
        };
        return data;
    }

    successHandler(callback, data) {
        this.pool.end();
        console.log(`Done`);
        this.ApiHelpers.httpResponse(callback, 200, data);
    }

    errorHandler(callback, error) {
        this.pool.end();
        console.log(`ERROR: ${error}`);
        this.ApiHelpers.httpResponse(callback, 500, {error: 'An error occurred when processing your request.'});
    }
}

exports.GetSurvey = GetSurvey;