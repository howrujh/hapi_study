'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: String,
    name: String,
    jwt: String,
    pass: String
});

const docSchema = mongoose.Schema({
    id : String,
    author: String,
    title: String,
    description: String,
    ok: Boolean,
    time: Date,
});

const User = mongoose.model("User", userSchema, 'users');
const Doc = mongoose.model("Doc", docSchema, 'docs');

module.exports = {
    User,
    Doc
}
