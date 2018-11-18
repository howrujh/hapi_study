'use strict';

require('dotenv').config();

const Hapi        = require('hapi');
const Inert       = require('inert');
const Vision      = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack        = require('./package.json');
const Fs          = require('fs');
const _           = require('lodash');

const { ApolloServer } = require('apollo-server-hapi');
// const { makeExecutableSchema } = require('graphql-tools');

const AuthJwt2    = require('hapi-auth-jwt2');
const mongoose = require('mongoose');

const AuthHandler = require('./handlers/auth');

const resolvers = require('./graphql/resolvers');
const typeDefs = require('./graphql/qlschema');

// const people = { // our "users database"
//     1: {
//       id: 1,
//       name: 'Jen Jones'
//     }
// };


// const validate = async function (decoded, request) {

//     // do your checks to see if the person is valid
//     if (!people[decoded.id]) {
//       return { isValid: false };
//     }
//     else {
//       return { isValid: true };
//     }
// };


// const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({typeDefs, resolvers});

const app = new Hapi.Server({
    host: process.env.API_HOST || '0.0.0.0',
    port: process.env.API_PORT || 28080
});

(async () => {


    const HapiSwaggerConfig = {
        plugin: HapiSwagger,
        options: {
            info: {
                title: Pack.name,
                description: Pack.description,
                version: Pack.version
            },
            swaggerUI: true,
            basePath: '/',
            pathPrefixSize: 2,
            jsonPath: '/docs/swagger.json',
            sortPaths: 'path-method',
            lang: 'en',
            tags: [
                { name: 'api' }
            ],
            documentationPath: '/',
            securityDefinitions: {}
        }
    };

    /* register plugins */
    await app.register([
        Inert,
        Vision,
        AuthJwt2,
        HapiSwaggerConfig
    ]);

    app.auth.strategy('jwt', 'jwt',
        {
            key: process.env.JWT_SECRET,          // Never Share your secret key
            validate: AuthHandler.Validate,            // validate function defined above
            verifyOptions: { algorithms: ['HS256'] }, // pick a strong algorithm
            headerKey: 'access-token'
        });

    app.auth.default('jwt');

    // require routes
    Fs.readdirSync('routes').forEach((file) => {

        _.each(require('./routes/' + file), (routes) => {

            app.route(routes);
        });
    });

    mongoose.connect(process.env.DB_URL, {
        user: process.env.DB_USER,
        pass: process.env.DB_PASS

    });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', async () => {

        await server.applyMiddleware({
            app,
            path: '/graphql',
            route: {
                auth: false
            }
        });

        await server.installSubscriptionHandlers(app.listener);

        // we're connected!
        console.log('mongo db connected');
        await app.start();
        console.log('Server running at:', app.info.uri);

    });

})();

module.exports = app;
