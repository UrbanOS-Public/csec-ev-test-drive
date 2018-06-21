const mysql = require('mysql');

class BetterSmartExperienceMySQLPool {
    constructor() {
        this.pool = mysql.createPool({
            connectionLimit: 2,
            host: process.env.host,
            user: process.env.user,
            password: process.env.password,
            database: 'smart_experience'
        });
    }


    end() {
        return new Promise((resolve, reject) => {
            this.pool.end((err) => {
                if (err) {
                    console.log(`ERROR WHEN CLOSING POOL.....`);
                    console.log(err);
                    reject(err);
                }
                resolve();
            });
        });
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
}



exports.BetterSmartExperienceMySQLPool = BetterSmartExperienceMySQLPool;