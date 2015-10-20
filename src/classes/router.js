var CONFIG = require('./../config/config');
var APP = require('./app');
var LANG = require('./lang');

var FILESYSTEM = require( 'fs');

var routes = {};

class ROUTER {
    static addRoute (route, fn) {
        var route_str = route.join('/');
        if (routes[route_str] !== undefined) {
            throw APP.internalError(LANG.ERROR_ROUTER_ALREADY_DEFINED, route_str);
        }
        routes[route_str] = fn;
    }
    static route (app) {
        //app.
    }
}

APP.registerInitName(__filename);

console.log('Loading Controllers...');
(() => {
    let awaitingEvents = new Set();
    function walk (path) {
        awaitingEvents.add(path);
        FILESYSTEM.readdir(path, (error, files) => {
            if (error) {
                throw error;
            }
            files.forEach((v) => {
                let file = `${ path }/${ v }`;
                awaitingEvents.add(file);
                FILESYSTEM.stat(file, (error, stats) => {
                    awaitingEvents.delete(file);
                    if (error) {
                        throw error;
                    }
                    if (stats.isDirectory()) {
                        walk(file);
                    } else if (stats.isFile()){
                        require(file);
                    }
                    checkWaiting();
                });
            });
            awaitingEvents.delete(path);
        });
    }
    function checkWaiting () {
        if (awaitingEvents.size === 0) {
            console.log('Controllers Loaded...');
            APP.triggerInitName(__filename);
            awaitingEvents = null;
        }
    }
    walk(CONFIG.get('controller_dir'));
})();

module.exports = ROUTER;