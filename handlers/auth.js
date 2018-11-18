'use strict';

require('dotenv').config();
const Boom = require('boom');
const JWT = require('jsonwebtoken');
//const moment = require('moment');
const DB = require('../db/db');

const crypto = require('crypto');

const GenerateJWT = (email, group) => {

    const token = JWT.sign({
        email,
        group
    }, process.env.JWT_SECRET , {
        expiresIn: '2d'
    });

    return token;
};

const AuthCreate = async (email, name, pw) => {

    const user = await DB.FindUserByEmail(email);
    if (user !== null) {
        return null;
    }
    const shasum = crypto.createHash('sha1');
    shasum.update(pw);
    const pwHash = shasum.digest('hex');
    console.log(`pw hash: ${pwHash}`);

    const token = GenerateJWT(email, 'user0');

    await DB.CreateUser(email, pwHash, name, token);

    return {
        email,
        name,
        access_token: token
    };
}

const PostAuthCreate = async (request, h) => {

    try {
        const email = request.payload.email;
        const name = request.payload.name;
        const pw = request.payload.password;

        return AuthCreate(email, name, pw);

    } catch (e) {
        console.log(e);
        return Boom.serverUnavailable();

    }
};

const AuthLogin = async (email, pw) => {

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

    return null;
}

const PostAuthLogin = async (request) => {

    try {

        const email = request.payload.email;
        const pw = request.payload.password;

        const loginResponse = await AuthLogin(email, pw);

        if(loginResponse) {
            return loginResponse;
        }

        return Boom.unauthorized();

    } catch (e) {
        console.log(e);
        return Boom.serverUnavailable();
    }
};


const GetAuthLogout = async (request) => {

    try {

        // const jwt = request.headers.access_token;
        if (request.auth && request.auth.credentials) {
            const email = request.auth.credentials.email;

            const updated = await DB.UpdateUserToken(email, '');
            // console.log(`logout updated: ${updated}`);

            return 'success';
        }

        return Boom.badRequest();

    } catch (e) {
        console.log(e);
        return Boom.serverUnavailable();
    }
};

const GetAuthInfo = async (request) => {

    try {

        if (request.auth && request.auth.credentials) {
            const email = request.auth.credentials.email;

            const user = await DB.FindUserByEmail(email);
            if (user) {

                return {
                    email: user.email,
                    name: user.name,
                    access_token: user.jwt
                };
            }
        }

        return Boom.badRequest();

    } catch (e) {
        console.log(e);
        return Boom.serverUnavailable();
    }
};

const Validate = async (decoded) => {

    try {
        if (decoded && decoded.email) {
            const user = await DB.FindUserByEmail(decoded.email);
            if (user) {
                if (user.jwt === '') {
                    return {
                        isValid: false
                    };
                }
                return {
                    isValid: true
                };

            }
        }

        return {
            isValid: false
        };

    } catch (e) {
        console.log(e);
        return {
            isValid: false
        };
    }
};

module.exports = {
    Validate,
    AuthLogin,
    AuthCreate,
    PostAuthCreate,
    GetAuthInfo,
    GetAuthLogout,
    PostAuthLogin
};
