const mysql = require('mysql');

module.exports.newPool = () => {
    return mysql.createPool({
        connectionLimit: 2,
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        database: 'smart_experience'
    });
};


module.exports.closePool = (pool) => {
    return new Promise((resolve, reject) => {
        pool.end((err) => {
            if (err) {
                console.log(`ERROR WHEN CLOSING POOL.....`);
                console.log(err);
                reject(err);
            }
            resolve();
        });
    });
};