const { dateToString } = require('../../helpers/date');

const transformBooking = booking => {
    return {
        ...booking._doc,
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    }
}
const transformEvent = event => {
    return {
        ...event._doc, date: dateToString(event._doc.date)
    }
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;