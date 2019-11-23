if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const bodyParser = require('body-parser');
const graphQlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Event = require('./models/event');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphQlHttp({
    schema: buildSchema(`
    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    type RootQuery {
        events: [Event!]!
    }
    
    type RootMutation {
        createEvent(eventInput: EventInput): Event
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }`),
    rootValue: {
        events: () => {
            return Event.find().
                then(events => {
                    return events.map(event => {
                        return { ...event._doc };
                    });
                }).
                catch(err => { throw err; })
        },
        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            });
            return event.save().then(result => {
                console.log(result);
                return { ...result._doc };
            }).catch(err => {
                console.log(err);
                throw err;
            });

        }
    },
    graphiql: true
}));

const encodedUser = encodeURI(process.env.MONGO_DB_USER);
const encodedPassword = encodeURI(process.env.MONGO_DB_PASSWORD);
const MONGO_URL = `mongodb+srv://${encodedUser}:${encodedPassword}@testing-graphql-event-p1usm.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(MONGO_URL, { useNewUrlParser: true })
    .then(() => {
        app.listen(3000);
    }).catch(err => {
        console.log(err);
    });