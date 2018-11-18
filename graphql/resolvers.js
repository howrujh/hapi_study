'user strict';

const AuthHandler = require('../handlers/auth');

const resolvers = {
    Query: {
        async hello() {
            return 'Hello world';
        }
    },
    Mutation: {
        async create (_, {email, name, pw}) {

            const loginResponse = await AuthHandler.AuthCreate(email, name, pw);
            return loginResponse;
        },
        async login(_, {email, pw}) {

            const loginResponse = await AuthHandler.AuthLogin(email, pw);
            return loginResponse;
        }
    }
};


module.exports = resolvers;