var CONFIG = require('./../config/config');

var APP = require('./app');
var CF = require('./common-functions');

var UTIL = require('util');
var FILESYSTEM = require( 'fs');

class LANG {
    static get (code, ...args) {
        return UTIL.format(code, ...args);
    }
    static add (code, str) {
        if (typeof this[code] === 'function') {
            throw `Cannot define ${ code } as a language constant`;
        }
        this[code] = str || '';
    }
}

APP.registerInitName(__filename);

console.log('Loading Language File...');

FILESYSTEM.readFile(CONFIG.get('lang'), 'utf8', function (err, data) {
    if (err) {
        throw err;
    }
    for (let line of CF.line_iterator(data)) {
        let match = line.match(/([^\s]+)\s+([^\n\r]+)/);
        LANG.add(match[1], match[2]);
    }

    console.log('Language File Loaded...');
    APP.triggerInitName(__filename);
});

module.exports = LANG;