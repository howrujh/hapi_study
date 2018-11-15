'use strict';

const Joi = require('joi');
const Handlers = require('../handlers/auth');
const SCHEMAS = require('../lib/schemas');


const mongoose = require('mongoose');
const API_BASE_PATH = '/auth';
const Boom = require('boom');

const routes = [];

// let users = [];

// POST /auth/create
routes.push({
    method: 'POST',
    path: API_BASE_PATH+'/create',
    options: {
        auth: false,
        handler: Handlers.PostAuthCreate,
        description: ' ',
        notes: 'create new account',
        // plugins: {
        //     'hapi-swagger': {
        //         responses: {
        //             '200': { description: 'Success', schema: Joi.object(SCHEMAS.User).label('Response') },
        //             '400': { description: 'Bad Request', schema: SCHEMAS.Error }
        //         },
        //         security: {}
        //     }
        // },
        tags: ['api'],
        validate: {
            payload: {
                name: Joi.string().required(),
                email: Joi.string().required(),
                password: Joi.string().required()
            }
        },
        response: {
            schema: SCHEMAS.User
        }
    }
});


routes.push({
    method: 'POST',
    path: API_BASE_PATH+'/login',
    options: {
        auth: false,
        handler: Handlers.PostAuthLogin,
        description: 'login',
        notes: 'This endpoint will update a jwt',
        // plugins: {
        //     'hapi-swagger': {
        //         responses: {
        //             '200': { description: 'Success', schema: Joi.object(SCHEMAS.User).label('Response') }
        //             // '401': { description: 'UnAuthorized', schema: Joi.string()   }
        //         },

        //         security: {}
        //     }
        // },
        tags: ['api'],
        validate: {
            payload: {
                email: Joi.string().required(),
                password: Joi.string().required()
            }
        },
        response: {
            schema: SCHEMAS.User
            // status: {
            //     401: Joi.string()
            // }
        }
    }
});

routes.push({
    method: 'GET',
    path: API_BASE_PATH+'/logout',
    options: {
        handler: Handlers.GetAuthLogout,
        description: 'user logout',
        notes: 'After this endpoint user need to login again.',
        // plugins: {
        //     'hapi-swagger': {
        //         responses: {
        //             '200': { description: 'Success', schema: Joi.string().label('Response') },
        //             '401': { description: 'UnAuthorized', schema: Joi.string()   }
        //         },
        //         security: {}
        //     }
        // },
        tags: ['api'],
        validate: {
            headers: {
                access_token: Joi.string().required()
            }
        },
        response: {
            status: {
                200: Joi.string()
            }
        }
    }
});

routes.push({
    method: 'GET',
    path: API_BASE_PATH+'/info',
    options: {
        handler: Handlers.GetAuthInfo,
        description: 'get user infomatjion',
        notes: 'This endpoint returns a user infomation',
        // plugins: {
        //     'hapi-swagger': {
        //         responses: {
        //             '200': { description: 'Success', schema: Joi.object(SCHEMAS.User).label('Response') },
        //         },
        //         security: {}
        //     }
        // },
        tags: ['api'],
        validate: {
            headers: {
                access_token: Joi.string().required()
            }
        },
        response: {
            schema: SCHEMAS.User
        }
    }
});

module.exports = routes;
