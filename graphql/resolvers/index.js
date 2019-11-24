const bcrypt = require('bcryptjs');


const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');

// const event =;
// const user = async userId => {
//     try {
//         const user = await User.findById(userId);
//         return {
//             ...user._doc,
//             createdEvents: events.bind(this, user._doc.createdEvents)
//         };
//     } catch (error) {
//         throw error;
//     }
// }
// const user = async userId => {
//     try {
//         const user = await User.findById(userId);
//         return {
//             ...user._doc,
//             createdEvents: events.bind(this, user._doc.createdEvents)
//         };
//     } catch (error) {
//         throw error;
//     }
// }


module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return {
                    ...event._doc,
                    date: new Date(event._doc.date).toISOString()
                };
            });
        } catch (error) {
            throw error;
        }
    },
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return {
                    ...booking._doc,
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString()
                }
            })
        } catch (error) {
            throw error;
        }
    },
    createEvent: async args => {
        try {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '5dd89d14facf4e1f5436269d'
            });
            let createdEvent;
            const eventSaveResult = await event.save();
            createdEvent = { ...eventSaveResult._doc, date: new Date(eventSaveResult._doc.date).toISOString() };
            const user = await User.findById('5dd89d14facf4e1f5436269d');
            if (!user) {
                throw new Error('User doesn\'t exist.');
            }
            user.createdEvents.push(event);
            await user.save();
            return createdEvent;
        } catch (error) {
            throw error;
        }
    },
    createUser: async (args) => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email });
            if (existingUser) {
                throw new Error('User exists already.')
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            const result = await user.save();
            return { ...result._doc, password: null };
        } catch (error) {
            throw error;
        }
    },
    bookEvent: async args => {
        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        const booking = new Booking({
            user: '5dd89d14facf4e1f5436269d',
            event: fetchedEvent
        });
        const result = await booking.save();
        return {
            ...result._doc,
            createdAt: new Date(result._doc.createdAt).toISOString(),
            updatedAt: new Date(result._doc.updatedAt).toISOString()
        };
    },
    cancelBooking: async args => {
        try {
            const booking = await Booking.findById({ _id: args.bookingId });
            const event = { ...booking.event._doc, _id: booking.event.id, creator: booking.event.creator };
            await Booking.deleteOne({ _id: args.bookingId });
            return event;
        } catch (error) {
            throw error;
        }
    }
}