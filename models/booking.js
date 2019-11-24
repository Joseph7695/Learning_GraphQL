const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

const bookingSchema = new Schema({
    event: { type: Schema.Types.ObjectId, ref: 'Event', autopopulate: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', autopopulate: true },
},
    { timestamps: true });

bookingSchema.plugin(autopopulate);
module.exports = mongoose.model('Booking', bookingSchema);
