import { LANG } from 'classes/lang';
import { EVENT } from 'classes/event';
import { TRIGGER } from 'classes/trigger';
import { ROUTER } from 'classes/router';

import CRYPTO from 'crypto';
import OS from 'os';
import HTTP from 'http';

var activeApps = new Set();
var cur_app_num = 0;

class APP {
    constructor (request, response) {
        activeApps.add(this);
        this.currentReq = request;
        this.currentResp = response;
        this.ip = this.getIP();
        this.ipVersion = this.getIPVersion();
        this.remotePort = this.getRemotePort();
        this.id = this.getGUID();
        console.log(`${ this.id } constructed`);

        this.controller = ROUTER.route(this);
    }
    close () {
        activeApps.delete(this);
    }
    getGUID () {
        var hostShaSum = CRYPTO.createHash('sha1');
        hostShaSum.update(OS.hostname());

        var hostname = hostShaSum.digest('hex').substr(0, 8);
        var time = parseInt((new Date()).getTime() / 1000).toString(16); // in hex
        var random = parseInt(Math.random() * 0xFFFF).toString(16);
        var next_num = cur_app_num++;
        var ip = this.ip; // FFFFFFFF

        if (this.ipVersion === 4) {
            let a = ip.split('.');
            let buf = new Buffer(4);
            for(var i = 0; i < 4; i++){
                buf.writeUInt8(a[i], i);
            }
            ip = buf.readUInt32BE(0).toString(16);
        }
        if (this.ipVersion !== 4) {
            let shasum = CRYPTO.createHash('sha1');
            shasum.update(ip);
            ip = shasum.digest('hex').substr(0, 8);
        }
        return `${ hostname }-${ time.substr(0, 4) }-${ time.substr(4) }-${ next_num }-${ ip }${ random }`;
        // example:
        // 21EC2020-3AEA-4069-A2DD-08002B30309D
    }
    getIP () {
        return this.currentReq.connection.remoteAddress;
    }
    getIPVersion () {
        return Number(this.currentReq.connection.remoteFamily.replace(/^IPv/, ''));
    }
    getRemotePort () {
        return this.currentReq.connection.remotePort;
    }
    static getApps () {
        var out = new Set();
        activeApps.forEach((v) => {
            out.add(v);
        });
        return out;
    }
    static internalError (code, ...args) {
        throw LANG.get(code, ...args);
    }
    static registerEvent (event_name, ...args) {
        if (this.EVENTS[event_name] === undefined) {
            return (this.EVENTS[event_name] = new EVENT(event_name, ...args));
        } else {
            this.internalError(LANG.ERROR_EVENT_ALREADY_REGISTERED, event_name);
        }
    }
    static registerTrigger (event, fn) {
        if (!(event instanceof EVENT)) {
            this.internalError(LANG.ERROR_FIRST_ARGUMENT_NOT_EVENT_OBJ, typeof event);
        }
        if (!(fn instanceof Function)) {
            this.internalError(LANG.ERROR_SECOND_ARGUMENT_NOT_FUNCTION, typeof fn);
        }
        event.addTrigger(new TRIGGER(fn));
    }
    static registerInitName (name) {
        this.INIT_EVENTS.add(name);
    }
    static triggerInitName (name) {
        this.INIT_EVENTS.delete(name);
    }
    static run (port) {
        this.SERVER = HTTP.createServer(this.incomingRequest).listen(port);
        console.log('');
    }
    static incomingRequest (request, response) {
        return new APP(request, response);
    }
}
APP.EVENTS = {};
APP.INIT_EVENTS = new Set();
APP.SERVER = null;

export { APP };
export default APP;