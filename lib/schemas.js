'use strict';

//
// We should store all of our shared schemas in one place
//

const Joi = require('joi');

module.exports.Error = Joi.object({
    error: {
        msg: Joi.string().min(3).description('Human readable error').default('An error has occurred.'),
        type: Joi.string().min(3).description('Type of error').default('GENERIC_ERR')
    }
}).label('Error');

module.exports.Product = {
    id:   Joi.number(),
    name: Joi.string()
};

module.exports.User = {
    email: Joi.string().required(),
    name: Joi.string().required(),
    access_token: Joi.string()
}

module.exports.Doc = {
    id: Joi.string().required(),
    author: Joi.string(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    ok: Joi.boolean().required(),
    time: Joi.number().max(0xffffffff)
}
