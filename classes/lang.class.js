import { sprintf } from 'sprintf-js';
import { CONFIG } from 'config';
import { APP } from 'app';
import * as FILESYSTEM from 'fs';
import { line_iterator } from 'common-functions';

class LANG {
    static get (code, ...args) {
        return sprintf(code, ...args);
    }
    static add (code, str) {
        if (typeof this[code] === 'function') {
            throw `Cannot define ${ code } as a language constant`;
        }
        this[code] = str || '';
    }
}

APP.registerInitName(__filename);

FILESYSTEM.readFile(CONFIG.get('lang'), 'utf8', function (err, data) {
    if (err) {
        throw err;
    }
    for (let line of line_iterator(data)) {
        let match = line.match(/([^\s]+)\s+([^\n\r]+)/);
        LANG.add(match[1], match[2]);
    }
    APP.triggerInitName(__filename);
});

export { LANG };
export default LANG;