const moment = require('moment');
const smartExperienceMySQLPool = require('./utils/SmartExperienceMySQLPool');
const AWS = require('aws-sdk');
const ses = new AWS.SES();

const NO_EMAILS_TO_SEND = 'No emails to send';

class JobSendConfirmationEmail {
    constructor(pool, moment, ses) {
        this.pool = pool;
        this.moment = moment;
        this.ses = ses;
    }

    handleEvent(event, context, callback) {
        this.getUserToSendEmailTo()
            .then((queryResponse) => this.extractFirstRow(queryResponse))
            .then((userAndDriveData) => this.sendEmail(userAndDriveData))
            .then((userAndDriveDataAndEmailStatus) => this.markAsEmailSent(userAndDriveDataAndEmailStatus))
            .then((data) => this.successHandler(callback, data), (err) => this.errorHandler(callback, err))
        ;
    }

    getUserToSendEmailTo() {
        return this.doQuery("select u.email, u.id as user_id, d.id as drive_id, udm.confirmation_number, d.date, d.scheduled_start_time, c.make, c.model, c.msrp from user_drive_map udm, user u, drive d, car c where u.id = udm.user_id and udm.drive_id = d.id and d.car_id = c.id and udm.email_sent = 0 order by udm.date_created asc limit 1");
    }

    extractFirstRow(queryResponse) {
        if (queryResponse.length === 0) {
            return Promise.reject(NO_EMAILS_TO_SEND);
        }
        return queryResponse[0];
    }

    sendEmail(userAndDriveData) {
        const TemplateData = {
            confirmation_number: userAndDriveData.confirmation_number,
            formatted_drive_time: this.moment(`${this.moment(userAndDriveData.date).format("YYYY-MM-DD")} ${userAndDriveData.scheduled_start_time}`).format("MMMM D, YYYY h:mma"),
            vehicle: `${userAndDriveData.make} ${userAndDriveData.model}`,
            msrp: userAndDriveData.msrp
        };
        const params = {
            Destination: {
                ToAddresses: [
                    userAndDriveData.email
                ]
            },
            Source: 'EV Test Drive <no-reply@drivesmartcbus.com>',
            Template: 'ConfirmationTemplate',
            ConfigurationSetName: 'DefaultConfigurationSet',
            TemplateData: JSON.stringify(TemplateData),
            ReplyToAddresses: [
                "no-reply@drivesmartcbus.com"
            ],
            ReturnPath: "no-reply@drivesmartcbus.com"
        };
        return new Promise((resolve) => {
            this.ses.sendTemplatedEmail(params).promise()
                .then((response) => {
                    console.log(`Sent confirmation email to ${userAndDriveData.email}`);
                    console.log(response);
                    resolve([userAndDriveData, response]);
                })
                .catch(err => {
                    console.log(`ERROR: Failed to send confirmation email to ${userAndDriveData.email}`);
                    console.log(err);
                    resolve([userAndDriveData, err]);
                });
        });
    }

    markAsEmailSent(userAndDriveDataAndEmailStatus) {
        const userAndDriveData = userAndDriveDataAndEmailStatus[0];
        const emailStatus = userAndDriveDataAndEmailStatus[1];
        var email_data;
        if (emailStatus.message) {
            email_data = emailStatus.message.slice(0, 1000);
        } else {
            email_data = JSON.stringify(emailStatus).slice(0, 1000);
        }
        return this.doQuery("update user_drive_map set email_sent = 1, email_data = ? where user_id = ? and drive_id = ?", [email_data, userAndDriveData.user_id, userAndDriveData.drive_id]);
    }


    doQuery(query, params) {
        return new Promise((resolve, reject) => {
            this.pool.query(query, params, function (error, results) {
                if (error) {
                    return reject(error);
                } else {
                    return resolve(results);
                }
            });
        });
    }

    successHandler(callback) {
        smartExperienceMySQLPool.closePool(this.pool);
        console.log(`Done`);
        callback(null);
    }

    errorHandler(callback, error) {
        smartExperienceMySQLPool.closePool(this.pool);
        if (NO_EMAILS_TO_SEND === error) {
            console.log(error);
            return callback(null);
        }
        console.log(`ERROR: ${error}`);
        callback(error);
    }
}

exports.JobSendConfirmationEmail = JobSendConfirmationEmail;
exports.handler = (event, context, callback) => {
    const jobArchiveCarSchedule = new JobSendConfirmationEmail(smartExperienceMySQLPool.newPool(), moment, ses);
    jobArchiveCarSchedule.handleEvent(event, context, callback);
};