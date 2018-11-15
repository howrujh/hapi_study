'use strict';

const isValid = (value, def) => {
    if(value === undefined || value === null) {
        return def;
    }
   return value;
}

module.exports = {
    isValid
}