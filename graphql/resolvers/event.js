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
    createEvent: async (args, req) => {
        if (!req.isAuth) { throw new Error('Unauthenticated'); }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: req.userId
        });
        try {

            let createdEvent;
            const eventSaveResult = await event.save();
            createdEvent = transformEvent(eventSaveResult);
            const user = await User.findById(req.userId);
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