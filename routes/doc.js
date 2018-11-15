'use strict';

const Joi = require('joi');
const Handlers = require('../handlers/doc');
const SCHEMAS = require('../lib/schemas');


const mongoose = require('mongoose');
const API_BASE_PATH = '/docs';
const Boom = require('boom');

const routes = [];

// let users = [];

// POST /doc
routes.push({
    method: 'POST',
    path: API_BASE_PATH,
    options: {
        handler: Handlers.PostDocCreate,
        description: ' ',
        notes: 'create new doc',
        // plugins: {
        //     'hapi-swagger': {
        //         responses: {
        //             '200': { description: 'Success', schema: Joi.object({data:SCHEMAS.Doc}).label('Response') },
        //             '400': { description: 'Bad Request', schema: SCHEMAS.Error }
        //         },
        //         security: {}
        //     }
        // },
        tags: ['api'],
        validate: {
            // headers: {
            //     access_token: Joi.string().required()
            // },
            payload: {
                title: Joi.string().required(), 
                description: Joi.string().required(), 
                ok: Joi.boolean().required(), 
            }
        },
        response: {
            schema: {
                data: SCHEMAS.Doc
            } 
        }
    }
});

// POST /doc
routes.push({
    method: 'GET',
    path: API_BASE_PATH,
    options: {
        handler: Handlers.GetDocs,
        description: ' ',
        notes: 'create new doc',
        // plugins: {
        //     'hapi-swagger': {
        //         responses: {
        //             '200': { description: 'Success', schema: Joi.object({data:SCHEMAS.Doc}).label('Response') },
        //             '400': { description: 'Bad Request', schema: SCHEMAS.Error }
        //         },
        //         security: {}
        //     }
        // },
        tags: ['api'],
        validate: {
            // headers: {
            //     access_token: Joi.string().required()
            // },
            query: {
                offset: Joi.number().min(0).max(0xffffffff),
                take: Joi.number().min(1).max(100)
            }
        },
        response: {
            schema: {
                data: Joi.array().items(SCHEMAS.Doc)
            } 
        }
    }
});


routes.push({
    method: 'PUT',
    path: API_BASE_PATH + '/{id}',
    options: {
        handler: Handlers.PutDocUpdate,
        description: ' ',
        notes: 'create new doc',
        // plugins: {
        //     'hapi-swagger': {
        //         responses: {
        //             '200': { description: 'Success', schema: Joi.object({data:SCHEMAS.Doc}).label('Response') },
        //             '400': { description: 'Bad Request', schema: SCHEMAS.Error }
        //         },
        //         security: {}
        //     }
        // },
        tags: ['api'],
        validate: {
            // headers: {
            //     access_token: Joi.string().required()
            // },
            params: {
                id: Joi.string().min(24).max(24)
            },
            payload: {
                title: Joi.string(), 
                author: Joi.string(), 
                description: Joi.string(), 
                ok: Joi.boolean(), 
            }
        },
        response: {
            schema: {
                data: SCHEMAS.Doc
            } 
        }
    }
});

routes.push({
    method: 'DELETE',
    path: API_BASE_PATH,
    options: {
        handler: Handlers.DeleteDoc,
        description: ' ',
        notes: 'delete doc',
        // plugins: {
        //     'hapi-swagger': {
        //         responses: {
        //             '200': { description: 'Success', schema: Joi.object({data:SCHEMAS.Doc}).label('Response') },
        //             '400': { description: 'Bad Request', schema: SCHEMAS.Error }
        //         },
        //         security: {}
        //     }
        // },
        tags: ['api'],
        validate: {
            // headers: {
            //     access_token: Joi.string().required()
            // },
            payload: {
                id: Joi.string().min(24).max(24)
            }
        },
        response: {
            status: {
                200: Joi.string()
            }
        }
    }
});

module.exports = routes;
