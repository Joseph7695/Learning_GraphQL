const Event = require('../../models/event');
const { transformEvent } = require('./merge');

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return transformEvent(event);
            });
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
            createdEvent = transformEvent(eventSaveResult);
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
    }
}