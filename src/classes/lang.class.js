import { CONFIG } from 'config/config';

import { util } from 'classes/util';
import { APP } from 'classes/app';
import { line_iterator } from 'classes/common-functions';

import FILESYSTEM from 'fs';

class LANG {
    static get (code, ...args) {
        return util.format(code, ...args);
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