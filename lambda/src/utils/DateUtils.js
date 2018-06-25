const moment = require('moment');

module.exports.todayInEST = () => {
    const isDST = moment().isDST();
    var offset = 5;
    if (isDST) {
        offset = 4;
    }
    return moment.utc().subtract(offset, 'hours');
};

module.exports.todayInESTFormatted = () => {
    return this.todayInEST().format("YYYY-MM-DD");
};

module.exports.yearMonthDayFormat = (dateString) => {
    return moment(dateString).format("YYYY-MM-DD");
};