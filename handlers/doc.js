'use strict';

const Boom = require('boom');
const JWT = require('jsonwebtoken');
const moment = require('moment');
const DB = require('../db/db');

const DEV_SECRET = 'DEV_SECRET';
const crypto = require('crypto');
const Util = require('../lib/utils');

const GetDocs = async (request, h) => {
    try {
        const offset= Util.isValid(request.query.offset, 0);
        const take= Util.isValid(request.query.take, 5);


        const dbDocs = await DB.FindDocs(offset, take);
        const docs = dbDocs.map((d) => {
            const time = DB.GetTimeFromObjectId(d._id);
            const id = DB.GetHexStringFromObjectId(d._id);

            return {
                id,
                author: d.author,
                title: d.title,
                description: d.description,
                ok: d.ok,
                time
            }
        })

        const data = {
            data: docs
        };

        console.log(data);

        return data;

    } catch (e) {
        console.log(e);
        return Boom.serverUnavailable();

    }
}

const PutDocUpdate= async (request, h) => {
    try {
        const title = request.payload.title;
        const author = request.payload.author;
        const description = request.payload.description;
        const ok = request.payload.ok;
        const id = request.params.id;

        const doc = await DB.UpdateDoc(id, title, author, description, ok );
        if(doc === null) {
            return Boom.badRequest();
        }
        const time = DB.GetTimeFromObjectId(doc._id);

        const data = {
            data: {
                id,
                author: doc.author,
                title: doc.title,
                description: doc.description,
                ok: doc.ok,
                time
            }
        };

        console.log(data);

        return data;

    } catch (e) {
        console.log(e);
        return Boom.serverUnavailable();

    }
}

const DeleteDoc = async (request, h) => {
    try {
        const id = request.payload.id;

        await DB.DeleteDoc(id);

        console.log('----------delete success ---')

        return 'success';

    } catch (e) {
        console.log(e);
        return Boom.serverUnavailable();

    }
}

const PostDocCreate = async (request, h) => {
    try {
        const title = request.payload.title;
        const description = request.payload.description;
        const ok = request.payload.ok;
        const author = request.payload.author? request.payload.author: 'unknown';

        const doc = await DB.CreateDoc(title, author, description, ok );
        const time = DB.GetTimeFromObjectId(doc._id);
        const id = DB.GetHexStringFromObjectId(doc._id);


        const data = {
            data: {
                id,
                author: doc.author,
                title: doc.title,
                description: doc.description,
                ok: doc.ok,
                time
            }
        };

        console.log(data);

        return data;

    } catch (e) {
        console.log(e);
        return Boom.serverUnavailable();

    }
}



module.exports = {
    PostDocCreate,
    PutDocUpdate,
    DeleteDoc,
    GetDocs
}