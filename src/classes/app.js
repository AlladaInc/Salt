var EVENT; //var EVENT = require('./event'); // SEE BELOW
var TRIGGER; // = require('./trigger'); // SEE BELOW
var ROUTER; // = require('./router'); // SEE BELOW
var LANG; // = require('./lang'); // SEE BELOW

var activeApps = new Set();
var app_incrementer = 0;
var initiated = false;

class APP {
    constructor () {
        this.app_num = app_incrementer++;
        this.req_time = new Date();
        activeApps.add(this);
    }
    route () {
        var route_str = this.getRoutingString();
        this.log('Got connection, trying to route: "' + route_str + '"...');
        this.controller = ROUTER.route(this, route_str);
    }
    done () {
        activeApps.delete(this);
    }
    getAppNum () {
        return this.app_num;
    }
    getReqTime () {
        return this.req_time;
    }
    securityError (code, ...args) {
        this.close();
        console.log(LANG.get.apply(LANG, [code, ...args]));
    }
    
    static getApps () {
        var out = new Set();
        activeApps.forEach((v) => {
            out.add(v);
        });
        return out;
    }
    static internalError (code, ...args) {
        throw LANG.get.apply(LANG, [code, ...args]);
    }
    static registerEvent (event_name, ...args) {
        if (this.EVENTS[event_name] === undefined) {
            return (this.EVENTS[event_name] = new EVENT(event_name, ...args));
        } else {
            this.internalError(LANG.ERROR_EVENT_ALREADY_REGISTERED, event_name);
        }
    }
    static runEvent (event_name, ...args) {
        if (this.EVENTS[event_name] === undefined) {
            this.internalError(LANG.ERROR_EVENT_NAME_NOT_SET, event_name);
        }
        this.EVENTS[event_name].run(...args);
    }
    static registerTrigger (event_name, fn) {
        if (this.EVENTS[event_name] === undefined) {
            this.internalError(LANG.ERROR_EVENT_NAME_NOT_SET, event_name);
        }
        if (!(fn instanceof Function)) {
            this.internalError(LANG.ERROR_SECOND_ARGUMENT_NOT_FUNCTION, typeof fn);
        }
        this.EVENTS[event_name].addTrigger(new TRIGGER(fn));
    }
    static registerInitName (name) {
        this.INIT_EVENTS.add(name);
    }
    static triggerInitName (name) {
        this.INIT_EVENTS.delete(name);
        this.tryInit();
    }
    static tryInit () {
        if (this.INIT_EVENTS.size === 0) {
            this.runEvent('APP_INITIATED');
            initiated = true;
        }
    }
    static isInitiated () {
        return initiated;
    }
}
APP.EVENTS = {};
APP.INIT_EVENTS = new Set();
APP.SERVER = null;

module.exports = APP;

EVENT = require('./event');
TRIGGER = require('./trigger');
LANG = require('./lang');
ROUTER = require('./router');

APP.registerEvent('APP_INITIATED', {
    onAddTrigger: (event, trigger) => {
        if (initiated) {
            trigger.run(event);
        }
    }
});