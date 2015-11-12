var ORACLEDB = require('oracledb');
var EVENTEMITTER = require('events').EventEmitter;
var CONFIG = require('./../config/config');

var SYS_APP = require('./sys_app');
var SYSTEMUSERGROUP = require('./../models/systemusergroup');

var DB_APP = new SYS_APP();

var SYSUSERGROUP_POOLS = new Map();

var rootInstance;

class DATABASE extends EVENTEMITTER {
    /* class Events:
     * release, close, closed
     *
     */
    constructor (app, connection) {
        super(app);

        var self = this;
        this.closed = false;
        this.closing = false;
        this.connection = connection;
        this._app = null;
        // This is done because of the way emits works
        this._closeFn = (...args) => {
            return self.close.apply(self, args);
        };

        this.setApp(app);

        this.constructor.emit('constructed', app);
    }
    setApp (app) {
        if (this._app) {
            this._app.removeListener('close', this._closeFn);
        }
        this._app = app;
        this._app.on('close', this._closeFn);

        this.emit('appSet', app);
    }
    getApp () {
        return this._app;
    }
    close () {
        if (this.isClosing()) {
            return this;
        }
        this.closing = true;
        this.emit('close');

        this.closeCheck();
        return this;
    }
    terminate () {
        if (this._releasing) {
            return this;
        }
        this._releasing = true;
        this.emit('release');

        var connection = this.getConnection();
        this.closing = true;
        if (connection) {
            this.getConnection().release((err) => {
                this.closed = true;
                this.connection = null;
                if (err) {
                    this.getApp().internalError(err);
                }
                this.emit('closed');
            });
        }
        return this;
    }
    isClosing () {
        return this.closing;
    }
    closeCheck () {
        if (this.isClosing() && this.getApp().canClose()) {
            let connection = this.getConnection();
            connection.break((err) => {
                if (err) {
                    SYS_APP.internalError(err);
                }
            });
            connection.release((err) => {
                if (err) {
                    SYS_APP.internalError(err);
                }
            });
        }
        return this;
    }
    getConnection () {
        return this.connection;
    }
    static initiate () {
        console.log('Initializing database as system user...');
        SYS_APP.registerInitName(__filename);

        ORACLEDB.getConnection({
            user          : CONFIG.get('relational_database.user'),
            password      : CONFIG.get('relational_database.password'),
            connectString : CONFIG.get('relational_database.connect_string')
        }, (err, connection) => {
            if (err) {
                APP.internalError(err);
                return;
            }
            rootInstance = new DATABASE(DB_APP, connection);
            console.log('Database system user initiated!');
            console.log('Creating user db pools');

            // Setup a pool for every sys user in the database.
            var groups_promise = SYSTEMUSERGROUP.query(DB_APP);
            groups_promise.then((resultObj) => {
                let userGroups = 0;
                for (let promise of resultObj) {
                    userGroups++;
                    promise.then((sysUserGroup) => {
                        let connectionInfo = sysUserGroup.getDBConnectionInfo();
                        console.log('Creating user pool #' + userGroups + ' "' + sysUserGroup.get('name') + '"...');
                        ORACLEDB.createPool(connectionInfo, (err, pool) => {
                            if (err) {
                                SYS_APP.internalError(err);
                                return;
                            }
                            SYSUSERGROUP_POOLS.set(sysUserGroup.get('id'), pool);
                            console.log('User pool #' + userGroups + ' "' + sysUserGroup.get('name') + '" created!');
                            userGroups--;
                            if (userGroups === 0) {
                                SYS_APP.triggerInitName(__filename);
                            }
                        });
                    }).fail((reason) => {
                        SYS_APP.internalError(reason);  
                    });
                }
            }).fail((reason) => {
                SYS_APP.internalError(reason);
            });
        });
    }
    static rootFactory () {
        return rootInstance;
    }
    static factory (app, user) {
        return new Promise((successFn, errorFn) => {
            var userGroup = user.get('sysusergroup');
            let pool
            if (!userGroup || !SYSUSERGROUP_POOLS.has(userGroup.get('id'))) {
                errorFn(LANG.ERROR_USER_POOL_NOT_EXIST, userGroup.get('id'));
                return;
            } else {
                pool = SYSUSERGROUP_POOLS.get(userGroup.get('id'));
            }
            app.log('Creating DB connection...');
            pool.createConnection((err, connection) => {
                if (err) {
                    errorFn(err);
                    return;
                }
                app.log('DB connection created!');
                successFn(new this(app, connection));
            });
        });
    }
}

module.exports = DATABASE;

DATABASE.DB_APP = DB_APP;

// Lazy extend
(() => {
    var eventObj = new EVENTEMITTER();
    for (let i in eventObj) {
        if (DATABASE[i] === undefined && eventObj[i] instanceof Function) {
            ((i) => {
                DATABASE[i] = function (...args) {
                    return eventObj[i].apply(this, args);
                };
            })(i);
        }
    }
})();

DATABASE.initiate();
