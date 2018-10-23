const extend = require('extend');
const Json2csvParser = require('json2csv').Parser;
const fs = require('fs');
const MailComposer = require('nodemailer/lib/mail-composer');
const childProcess = require('child_process');

class EmailAnalytics {
    constructor(pool, moment, ses) {
        this.pool = pool;
        this.moment = moment;
        this.ses = ses;
    }

    handleEvent(event, context, callback, today, oneWeekAgo, yesterday) {
        console.log(`starting`);
        console.log(`Dates...`);
        console.log(today);
        console.log(oneWeekAgo);
        console.log(yesterday);

        const driveDataPromise = this.getTransformedDriveDataForThisWeek(oneWeekAgo, today);
        const surveyDataPromise = this.getSurveyDataForThisWeek(oneWeekAgo, today);
        const carCountPromise = this.getCarCountsForTheWeek(oneWeekAgo, today);
        const dayOfTheWeekPromise = this.getDayOfTheWeekCountsForTheWeek(oneWeekAgo, today);
        const timeSlotPromise = this.getTimeSlotCountsForTheWeek(oneWeekAgo, today);

        Promise.all([driveDataPromise, surveyDataPromise, carCountPromise, dayOfTheWeekPromise, timeSlotPromise])
            .then((promiseResults) => this.saveCSVs(promiseResults, oneWeekAgo, yesterday))
            .then((archivePath) => this.sendEmail(archivePath, oneWeekAgo, yesterday))
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
                    email: row.email,
                    phone: row.phone,
                    zipcode: row.zipcode,
                    make: row.make,
                    model: row.model,
                    passenger_count: row.passenger_count
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
                d.passenger_count,
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

    getCarCountsForTheWeek(oneWeekAgo, today) {
        const query = `
            select 
                c.make,
                c.model, 
                count(d.id) as number_of_scheduled_drives 
            from 
                car c 
                left outer join drive d on c.id = d.car_id and d.date >= ? and d.date < ? 
            group by c.make, c.model
        `;
        return this.pool.doQuery(query, [oneWeekAgo, today])
            .then((data) => this.transformCarCountData(data));
    }

    transformCarCountData(data) {
        return data.map((row) => {
            return {
                make: row.make,
                model: row.model,
                number_of_scheduled_drives: row.number_of_scheduled_drives
            }
        });
    }

    getDayOfTheWeekCountsForTheWeek(oneWeekAgo, today) {
        const query = `
            select
                date_format(d.date, '%w') as day_of_the_week_index, 
                date_format(d.date, '%W') as day_of_the_week, 
                count(d.id) as number_of_scheduled_drives 
            from 
                drive d 
            where 
                    d.date >= ? 
                and d.date < ?
            group by day_of_the_week
            order by day_of_the_week_index asc
        `;

        return this.pool.doQuery(query, [oneWeekAgo, today])
            .then((data) => this.transformDayOfTheWeekData(data));
    }

    transformDayOfTheWeekData(data) {
        return data.map((row) => {
            return {
                day_of_the_week: row.day_of_the_week,
                number_of_scheduled_drives: row.number_of_scheduled_drives
            }
        });
    }

    getTimeSlotCountsForTheWeek(oneWeekAgo, today) {
        const query = `
            select 
                d.scheduled_start_time, 
                count(d.id) as number_of_scheduled_drives
            from drive d 
            where 
                    d.date >= ? 
                and d.date < ?
            group by d.scheduled_start_time
            order by d.scheduled_start_time asc
        `;

        return this.pool.doQuery(query, [oneWeekAgo, today])
            .then((data) => this.transformTimeSlotData(data));
    }

    transformTimeSlotData(data) {
        return data.map((row) => {
            return {
                scheduled_start_time: row.scheduled_start_time,
                number_of_scheduled_drives: row.number_of_scheduled_drives
            }
        });
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
                passenger_count: row.passenger_count,
                make: row.make,
                model: row.model,
                post_survey_status: row.user_response_id === null ? "Not Taken" : "Taken"
            }
        });
    }

    saveCSVs(promiseResults, oneWeekAgo, yesterday) {
        const driveData = promiseResults[0];
        const surveyData = promiseResults[1];
        const carCounts = promiseResults[2];
        const dayOfTheWeek = promiseResults[3];
        const timeSlot = promiseResults[4];
        let promises = [];

        const dealerContacts = surveyData.filter((survey) => {
            return survey['POST - Would you like someone from the local dealership to contact you with more information about electric vehicles (EVs)?'] === 'Yes, and I give you permission to share my contact information for this purpose';
        }).map((dealerContact) => {
            return {
                date: dealerContact.date,
                first_name: dealerContact.first_name,
                last_name: dealerContact.last_name,
                email: dealerContact.email,
                phone: dealerContact.phone,
                zipcode: dealerContact.zipcode,
                make: dealerContact.make,
                model: dealerContact.model
            }
        });

        if (driveData.length > 0) {
            promises.push(this.writeCSV(driveData, "/tmp/reports", "drive.csv"))
        }
        if (surveyData.length > 0) {
            promises.push(this.writeCSV(surveyData, "/tmp/reports", "survey.csv"))
        }
        if (carCounts.length > 0) {
            promises.push(this.writeCSV(carCounts, "/tmp/reports", "cars.csv"));
        }
        if (dayOfTheWeek.length > 0) {
            promises.push(this.writeCSV(dayOfTheWeek, "/tmp/reports", "dayOfTheWeek.csv"));
        }
        if (timeSlot.length > 0) {
            promises.push(this.writeCSV(timeSlot, "/tmp/reports", "timeSlot.csv"));
        }
        if (dealerContacts.length > 0) {
            promises.push(this.writeCSV(dealerContacts, "/tmp/reports", "dealerContacts.csv"));
        }

        return new Promise((resolve, reject) => {
            Promise.all(promises)
                .then(() => {
                    const archivePath = `/tmp/weekly_report_${oneWeekAgo}_${yesterday}.zip`;
                    childProcess.exec(`src/utils/zip -r -j -P ***REMOVED*** ${archivePath} /tmp/reports`, (err) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(archivePath);
                    })
                })
                .catch(err => {
                    reject(err);
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

    sendEmail(archivePath, oneWeekAgo, yesterday) {
        return new Promise((resolve, reject) => {
            const mailOptions = {
                from: `EV Test Drive <${process.env.email}>`,
                sender: process.env.email,
                to: [process.env.send_to_email],
                replyTo: process.env.email,
                subject: `EV Test Drive Weekly Analytics`,
                text: `Attached are the analytics for ${oneWeekAgo} through ${yesterday}`,
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

exports.EmailAnalytics = EmailAnalytics;