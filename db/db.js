'use strict';

const Models = require('./models');
const mongoose = require('mongoose');

const GetTimeFromObjectId = (id) => {
    try {
        const time =mongoose.Types.ObjectId(id).getTimestamp().getTime()/1000;
        return time;
    } catch(e) {
        console.log(e);
        return -1;
    }
}

const GetHexStringFromObjectId =(id) => {
    try {
        const hexStrId =mongoose.Types.ObjectId(id).toHexString();
        return hexStrId;
    } catch(e) {
        console.log(e);
        return "";
    }
}

const FindDocs= (offset, take) => {
    return new Promise((resolve, reject) => {
        Models.Doc.find({ }).skip(offset).limit(take).exec((err, docs) => {
            if(err) {
                reject(err);
            }
            resolve(docs);
        })
    })
}
const DeleteDoc= (id) => {
    return new Promise((resolve, reject) => {
        const _id = mongoose.Types.ObjectId(id);

        console.log('---------delete doc------')
        Models.Doc.findOneAndDelete({ _id}, (err) => {
            if(err) {
                reject(err);
            }
            resolve();
        })
    })
}

const CreateDoc = (title, author,desc, ok) => {
    return new Promise((resolve, reject) => {

        var obj = {
            title,
            author,
            description: desc,
            ok
        };

        var doc = new Models.Doc(obj);
        
        doc.save((err, d) => {
           if (err) {
                reject(err);
            }
            resolve(d)
        });
    })
}
const UpdateDoc = (id, title, author, description, ok ) => {
    let obj = {};
    if(title) {
        obj['title'] = title;
    }
    if(author) {
        obj['author'] = author;
    }
    if(description) {
        obj['description'] = description;
    }
    if(ok) {
        obj['ok'] = ok;
    }
    const _id = mongoose.Types.ObjectId(id);
    console.log(`id: ${id}, _id: ${_id}, doc: ${obj}`);
    console.log(obj);
    return new Promise((resolve, reject) => {
        Models.Doc.findOneAndUpdate({_id}, {$set: obj }, (err, u) => {
            if(err) {
                reject(err);
            }
            resolve(u);
        })
    })
}

const FindUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        Models.User.findOne({ email: email }, (err, u) => {
            if(err) {
                reject(err);
            }
            resolve(u);
        })
    })
}

const UpdateUserToken = (email, token) => {
    return new Promise((resolve, reject) => {
        Models.User.findOneAndUpdate({email:email}, {$set: { jwt: token } }, (err, u) => {
            if(err) {
                reject(err);
            }
            resolve(u);
        })
    })
}

const CreateUser = (email, pass, name, jwt) => {
    return new Promise((resolve, reject) => {

        var obj = {
            email,
            pass,
            jwt,
            name
        };

        var user = new Models.User(obj);
        user.save((err) => {
            if (err) {
                reject(err);
            }
            resolve()
        });
    })
}



module.exports = {
    GetTimeFromObjectId,
    GetHexStringFromObjectId,
    CreateDoc,
    UpdateDoc,
    DeleteDoc,
    FindDocs,
    FindUserByEmail,
    UpdateUserToken,
    CreateUser
}