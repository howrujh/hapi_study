'use strict';

// requires for testing
const Code      = require('code');
const expect    = Code.expect;
const Lab       = require('lab');
const lab       = exports.lab = Lab.script();

// use some BDD verbage instead of lab default
const describe  = lab.describe;
const it        = lab.it;

// we require the handlers directly, so we can test the "Lib" functions in isolation
const Util = require('../../lib/utils');

describe('unit tests - util', () => {

    it('should be valid string 3', async () => {

        // test valid function
        const result = await Util.isValid('3', '1');
        expect(result).to.be.an.string().and.equal('3');
    });

    it('should be default string 1', async () => {

        // test valid function
        const result = await Util.isValid(undefined, '1');
        expect(result).to.be.an.string().and.equal('1');
    });

    it('should be default number 1', async () => {

        // test valid function
        const result = await Util.isValid(null, 1);
        expect(result).to.be.an.number().and.equal(1);
    });

});
