var PROCESS = require('process');
var EVENTEMITTER = require('events').EventEmitter;
var ROUTER; // = require('./router'); // SEE BELOW
var LANG; // = require('./lang'); // SEE BELOW
var RELATIONAL_DATABASE; // = require('./relational_database'); // SEE BELOW

var activeApps = new Set();
var sysApps = new Set();

var app_incrementer = 0;
var initiated = false;

var INIT_EVENTS = new Set();
var EXITING = false;

class APP extends EVENTEMITTER {
    /* Static Events:
     * exit, appInitiated
     * 
     * Object Events:
     * close, closed
     */
    constructor (...args) {
        super (...args);

        this._locks = new Set();
        this.app_num = app_incrementer++;
        this.req_time = new Date();
        this.dbConnection = null; // set below

        if (this.isSysApp()) {
            sysApps.add(this);
        } else {
            activeApps.add(this);
        }
        this.constructor.emit('appCreated', this);
    }
    route () {
        var route_str = this.getRoutingString();
        this.log('Got connection, trying to route: "' + route_str + '"...');
        this.controller = ROUTER.route(this, route_str);
    }
    close (time_limit) {
        if (this.closing) {
            return true;
        }
        this.closing = true;
        this.emit('close', time_limit);
        this.constructor.emit('appClose', this, time_limit);
        return false;
    }
    closed () {
        this.timers.forEach((timer) =>{
            clearTimeout(timer);
        });
        if (activeApps.has(this)) {
            activeApps.delete(this);
        } else if (sysApps.has(this)) {
            sysApps.delete(this);
        }

        this.emit('closed');
        this.constructor.emit('appClosed', this);
    }
    lock (name) {
        return this._locks.add(name);
    }
    unlock (name) {
        return this._locks.delete(name);
    }
    isLocked () {
        return (this._locks.size === 0);
    }
    canClose () {
        return this.isLocked();
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
    getCurrentUserId () {
        // TODO: setup current user here
        return null;
    }
    getRequestId () {
        // TODO: set this up
        return null;
    }
    getTransactionId () {
        // TODO: set this up
        return null;
    }
    getCurrentAppId () {
        return this.app_num;
    }
    getRootAppId () {
        return this.constructor.rootAppId;
    }
    getRelationalDB () {
        if (!this.dbConnection) {
            this.dbConnection = RELATIONAL_DATABASE.factory(this, this.getUser());
        }
    }
    getUser () {
        return {
            
        };
    }
    setTimeout (callback, delay) {
        if (this.currentResp) {
            let timer = setTimeout(() => {
                this.timers.delete(timer);
                callback();
            }, delay);
            this.timers.add(timer);
            return timer;
        }
        return false;
    }
    clearTimeout (timerObj) {
        this.timers.delete(timerObj);
        return clearTimeout(timerObj);
    }
    isSysApp () {
        return false;
    }

    // This is done to protect from exposing the actual list of apps
    static getApps () {
        var out = new Set();
        activeApps.forEach((v) => {
            out.add(v);
        });
        return out;
    }
    static getActiveAppsCount () {
        return activeApps.size;
    }
    static getSysApps () {
        var out = new Set();
        sysApps.forEach((v) => {
            out.add(v);
        });
        return out;
    }
    static getSystemAppsCount () {
        return sysApps.size;
    }
    static internalError (code, ...args) {
        console.trace();
        throw LANG.get.apply(LANG, [code, ...args]);
    }
    static registerInitName (name) {
        INIT_EVENTS.add(name);
    }
    static triggerInitName (name) {
        INIT_EVENTS.delete(name);
        this.emit('initNameTriggered', name);
        this.tryInit();
    }
    static tryInit () {
        if (INIT_EVENTS.size === 0) {
            this.emit('appInitiated');
            initiated = true;
        }
    }
    static isExiting () {
        return EXITING;
    }
    static isInitiated () {
        return initiated;
    }
    static terminate () {
        var apps = this.getApps();

        console.log(`Sending close signal to ${ apps.size } active apps...`);
        apps.forEach((app) => {
            app.close(10);
        });
        var checkClose = () => {
            if (this.getActiveAppsCount() === 0) {
                var sysApps = this.getSysApps();
                console.log(`Sending close signal to ${ sysApps.size } sys apps...`);
                sysApps.forEach((app) => {
                    app.close(10);
                });
            }
        };
        this.on('appClosed', checkClose);

        checkClose();
    }
    static get ROOTAPPCLASS () {
        return APP;
    }
    static set ROOTAPPCLASS (v) { }

    // may only be called once
    static registerApp (app_class) {
        // This is a crazy hack used to allow override of APP class to an extender app class
        module.exports = app_class;

        LANG = require('./lang');
        ROUTER = require('./router');
        app_class.on('newListener', (event, fn) => {
            if (initiated && event === 'appInitiated') {
                fn();
            }
        });
        app_class.on('removeListener', (event) => {
            if (event === 'exit' && app_class.listenerCount(event) === 0) {
                console.log('Exited safely!');
                PROCESS.exit();
            }
        });

        let exitFn = () => {
            var promise = app_class.terminate();
            promise.then(() => {
                app_class.removeListener('exit', exitFn);
            });
        };
        app_class.on('exit', exitFn);
        PROCESS.on('SIGINT', () => {
            EXITING = true;
            console.log("Exiting...");
            app_class.emit('exit');
        });
    }
}

// Lazy extend
(() => {
    var eventObj = new EVENTEMITTER();
    for (let i in eventObj) {
        if (APP[i] === undefined && eventObj[i] instanceof Function) {
            ((i) => {
                APP[i] = function (...args) {
                    return eventObj[i].apply(APP, args);
                };
            })(i);
        }
    }
})();

module.exports = APP;

RELATIONAL_DATABASE = require('./relational_database');