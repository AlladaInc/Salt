var APP = require('./APP');

var RESULTS_CACHE = new WeakMap();

class RELATIONAL_DATABASE_RESULT {
    constructor (app, result) {
        if (!RESULTS_CACHE.has(app)) {
            RESULTS_CACHE.set(app, new WeakSet());
        }
        var cacheObj = RESULTS_CACHE.get(app);
        cacheObj.add(this);

        this._result = result;
        this._released = false;
    }
    close () {
        this._released = true;
        if (this._released === false) {
            this._result.close((err) => {
                console.log(err);
            });
        }

        var cacheObj = RESULTS_CACHE.get(app);
        cacheObj.delete(this);
    }
    getColIndex (name) {
        var index = this._result.metaData.indexOf(name);
        if (index === -1) {
            return false;
        }
        return index;
    }
    getColName (number) {
        if (this._result.metaData.length < number) {
            return this._result.metaData[number];
        }
    }
    getRow () {
        return new Promise((success, failure) => {
            this._result.getRow((err, row) => {
                if (err) {
                    failure(err);
                } else {
                    success(row);
                }
            });
        });
    }
}
module.exports = RELATIONAL_DATABASE_RESULT;

APP.on('appClosed', function (app) {
    if (RESULTS_CACHE.has(app)) {
        let results = RESULTS_CACHE.get(app);
        for (result of results) {
            result.close();
        }
        RESULTS_CACHE.delete(app);
    }
});