'use strict';

require('dotenv').config();
const Boom = require('boom');
const JWT = require('jsonwebtoken');
//const moment = require('moment');
const DB = require('../db/db');

const crypto = require('crypto');

const GenerateJWT = (email, group) => {
    const token = JWT.sign({
        email: email,
        group: 'user0'
    }, process.env.JWT_SECRET , {
        expiresIn: '2d'
    });

    return token;

}

const PostAuthCreate = async (request, h) => {
    try {
        const body = request.payload;

        const email = request.payload.email;
        const name = request.payload.name;
        const pw = request.payload.password;

        const user = await DB.FindUserByEmail(email);
        if(user !== null) {
            return Boom.methodNotAllowed();
        }
        const shasum = crypto.createHash('sha1');
        shasum.update(pw);
        const pwHash = shasum.digest('hex');
        console.log(`pw hash: ${pwHash}`);

        const token = GenerateJWT(email, 'user0');

        await DB.CreateUser(email, pwHash, name, token);

        return {
            email: email,
            name: name,
            access_token: token
        };

    } catch (e) {
        console.log(e);
        return Boom.serverUnavailable();

    }
}

const PostAuthLogin = async (request, h) => {
    try {

        const email = request.payload.email;
        const pw = request.payload.password;

        const shasum = crypto.createHash('sha1');
        shasum.update(pw);
        const pwHash = shasum.digest('hex');

        const u = await DB.FindUserByEmail(email);
        if (u && pwHash === u.pass) {

            const token = GenerateJWT(email, 'user0');

            // multiple jwt is not supported yet.
            const updated = await DB.UpdateUserToken(email, token);
            console.log(`login updated: ${updated}`);

            return {
                email: u.email,
                name: u.name,
                access_token: token
            };
        }

        return Boom.unauthorized();

    } catch (e) {
        console.log(e);
        return Boom.serverUnavailable();
    }
}


const GetAuthLogout = async (request, h) => {
    try {

        // const jwt = request.headers.access_token;
        console.log(request.auth)
        if(request.auth && request.auth.credentials) {
            const email = request.auth.credentials.email;

            const updated = await DB.UpdateUserToken(email, '');
            console.log(`logout updated: ${updated}`);

            return 'success';
        }

        return Boom.badRequest();

    } catch (e) {
        console.log(e);
        return Boom.serverUnavailable();
    }
}
const GetAuthInfo = async (request, h) => {
    try {

        if(request.auth && request.auth.credentials) {
            const email = request.auth.credentials.email;

            const user = await DB.FindUserByEmail(email);
            if (user) {

                return {
                    email: user.email,
                    name: user.name,
                    access_token:user.jwt 
                };
            }
        }

        return Boom.badRequest();

    } catch (e) {
        console.log(e);
        return Boom.serverUnavailable();
    }
}

const Validate = async (decoded, request) => {
    try {
        if (decoded && decoded.email) {
            const user = await DB.FindUserByEmail(decoded.email);
            if (user) {
                if(user.jwt == "") {
                    return {
                        isValid: false
                    }
                }
                return {
                    isValid: true
                }

            }
        }

        return {
            isValid: false
        }

    } catch (e) {
        console.log(e);
        return {
            isValid: false
        }
    }
}

module.exports = {
    Validate,
    PostAuthCreate,
    GetAuthInfo,
    GetAuthLogout,
    PostAuthLogin
}