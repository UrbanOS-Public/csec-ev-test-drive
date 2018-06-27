const moment = require('moment');
const {BetterSmartExperienceMySQLPool} = require('./utils/BetterSmartExperienceMySQLPool');
const dateUtils = require('./utils/DateUtils');
const extend = require('extend');
const Json2csvParser = require('json2csv').Parser;
const fs = require('fs');
const MailComposer = require('nodemailer/lib/mail-composer');
const childProcess = require('child_process');
const AWS = require('aws-sdk');
const ses = new AWS.SES();

class JobWeeklyEmailAnalytics {
    constructor(pool, moment, dateUtils, ses) {
        this.pool = pool;
        this.moment = moment;
        this.dateUtils = dateUtils;
        this.ses = ses;
    }

    handleEvent(event, context, callback) {
        // const today = this.moment(this.dateUtils.todayInESTFormatted());
        console.log(`starting`);
        const today = this.moment("2018-07-06").format("YYYY-MM-DD");
        const oneWeekAgo = this.moment(today).subtract(7, "days").format("YYYY-MM-DD");

        const surveyDataPromise = this.getSurveyDataForThisWeek(oneWeekAgo, today);
        const driveDataPromise = this.getTransformedDriveDataForThisWeek(oneWeekAgo, today);

        Promise.all([driveDataPromise, surveyDataPromise])
            .then(([driveData, surveyData]) => this.saveCSVs(surveyData, driveData))
            .then((archivePath) => this.sendEmail(archivePath))
            .then((data) => this.successHandler(callback, data), (err) => this.errorHandler(callback, err))
    }

    getSurveyDataForThisWeek(oneWeekAgo, today) {
        return this.getDrivesForThisWeek(oneWeekAgo, today)
            .then((driveAndSurveyData) => this.transformSurveyData(driveAndSurveyData))
    }

    transformSurveyData(driveAndSurveyData) {
        const drivesToGetSurveyResultsFor = driveAndSurveyData.filter((drive) => {
            return drive.user_response_id !== null;
        });

        const promises = drivesToGetSurveyResultsFor.map((row) => {
            const date = this.moment(row.date);
            return new Promise((resolve, reject) => {
                const baseData = {
                    date: date.format("YYYY-MM-DD"),
                    day_of_the_week: date.format("dddd"),
                    start_time_24_hr: row.scheduled_start_time,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    phone: row.phone,
                    zipcode: row.zipcode,
                    make: row.make,
                    model: row.model
                };
                const preSurveyPromise = this.getPreSurveyResults(row.user_id);
                const postSurveyPromise = this.getPostSurveyResults(row.user_response_id);

                Promise.all([preSurveyPromise, postSurveyPromise])
                    .then((surveyData) => {
                        const preSurveyData = surveyData[0];
                        const postSurveyData = surveyData[1];
                        const value = extend({}, baseData, preSurveyData, postSurveyData);
                        resolve(value);
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        });

        return Promise.all(promises);
    }

    getPostSurveyResults(user_response_id) {
        const query = `
        select 
            sq.text as question, 
            sqo.text as answer, 
            ura.text as optional_text 
        from 
            user_response_answer ura, 
            survey_question sq, 
            survey_question_option sqo 
        where 
                ura.survey_question_id = sq.id 
            and ura.survey_question_option_id = sqo.id 
            and ura.user_response_id = ?
        `;
        return new Promise((resolve, reject) => {
            this.pool.doQuery(query, [user_response_id])
                .then((results) => {
                    let obj = {};
                    results.forEach((result) => {
                        const answer = result.optional_text === null ? result.answer : result.optional_text;
                        obj[`POST - ${result.question}`] = answer;
                    });
                    resolve(obj);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    getPreSurveyResults(user_id) {
        const query = `
        select 
            sq.text as question, 
            sqo.text as answer, 
            ura.text as optional_text 
        from 
            user_response ur,
            user_response_answer ura, 
            survey_question sq, 
            survey_question_option sqo,
            survey s,
            user u 
        where 
                ur.id = ura.user_response_id
            and ura.survey_question_id = sq.id 
            and ura.survey_question_option_id = sqo.id
            and ur.survey_id = s.id
            and s.type = 'PRE' 
            and ur.user_id = ?
        `;
        return new Promise((resolve, reject) => {
            this.pool.doQuery(query, [user_id])
                .then((results) => {
                    let obj = {};
                    results.forEach((result) => {
                        const answer = result.optional_text === null ? result.answer : result.optional_text;
                        obj[`PRE - ${result.question}`] = answer;
                    });
                    resolve(obj);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }


    getTransformedDriveDataForThisWeek(oneWeekAgo, today) {
        return this.getDrivesForThisWeek(oneWeekAgo, today)
            .then((driveAndSurveyData) => this.transformDriveData(driveAndSurveyData));
    }

    getDrivesForThisWeek(oneWeekAgo, today) {
        const query = `
            select 
                d.date,
                u.id as user_id,
                u.email,
                u.phone,
                u.zipcode,
                u.first_name,
                u.last_name,
                d.scheduled_start_time,
                c.make,
                c.model,
                ur.id as user_response_id
            from
                drive d
                inner join user_drive_map udm on d.id = udm.drive_id
                inner join user u on udm.user_id = u.id
                inner join car c on d.car_id = c.id 
                left outer join user_response ur on udm.confirmation_number = ur.confirmation_number
                left outer join survey s on ur.survey_id = s.id and s.type = 'POST'
            where
                    d.date >= ?
                and d.date < ?
            order by
                d.date, d.scheduled_start_time asc
        `;
        return this.pool.doQuery(query, [oneWeekAgo, today]);
    }

    transformDriveData(driveAndSurveyData) {
        return driveAndSurveyData.map((row) => {
            const date = this.moment(row.date);
            return {
                date: date.format("YYYY-MM-DD"),
                day_of_the_week: date.format("dddd"),
                start_time_24_hr: row.scheduled_start_time,
                first_name: row.first_name,
                last_name: row.last_name,
                make: row.make,
                model: row.model,
                post_survey_status: row.user_response_id === null ? "Not Taken" : "Taken"
            }
        });
    }

    saveCSVs(surveyData, driveData) {
        const p1 = this.writeCSV(surveyData, "/tmp/reports", "survey.csv");
        const p2 = this.writeCSV(driveData, "/tmp/reports", "drive.csv");
        console.log('Data...');
        console.log(surveyData);
        console.log(driveData);

        return new Promise((resolve, reject) => {
            Promise.all([p1, p2])
                .then((data) => {
                    const archivePath = '/tmp/archive.zip';
                    childProcess.exec(`src/utils/zip -r -j -P 17043215 ${archivePath} /tmp/reports`, (err, stout, stderr) => {
                        if(err) {
                            return reject(err);
                        }
                        resolve(archivePath);
                    })
                })
                .catch(err => {
                    console.log(err);
                });
        });
    }

    writeCSV(rows, dir, filename) {
        return new Promise((resolve, reject) => {
            const fields = Object.keys(rows[0]);
            const opts = {fields};
            const parser = new Json2csvParser(opts);
            const csv = parser.parse(rows);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            fs.writeFile(`${dir}/${filename}`, csv, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    }

    sendEmail(archivePath) {
        return new Promise((resolve, reject) => {
            const mailOptions = {
                from: `EV Test Drive <${process.env.email}>`,
                sender: process.env.email,
                to: ['jolson@pillartechnology.com'],
                replyTo: process.env.email,
                subject: "weekly email",
                text: "Weekly analytics",
                attachments: [
                    {path: archivePath}
                ]
            };
            let mail = new MailComposer(mailOptions);
            mail.compile().build((err, message) => {
                this.ses.sendRawEmail({RawMessage: {Data: message}}).promise()
                    .then((resp) => {
                        resolve(resp);
                    })
                    .catch(err => {
                        reject(err);
                    });
            })
        });
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
    new JobWeeklyEmailAnalytics(new BetterSmartExperienceMySQLPool(), moment, dateUtils, ses)
        .handleEvent(event, context, callback)
    ;
};