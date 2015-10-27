var APP = require('./app');
var LANG = require('./lang');

var routes = new Map();

class ROUTER {
    static addRoute (route_rx, control) {
        if (routes.has(route_rx)) {
            throw APP.internalError(LANG.ERROR_ROUTER_ALREADY_DEFINED, route_rx.toString());
        }
        routes.set(route_rx, control);
    }
    static addSimpleRoute (route_str, control, allow_slash) {
        allow_slash = !!allow_slash;
        return this.addRoute(new RegExp('^' + route_str + '(?:' + (allow_slash ? '\\/|' : '') + '\\?|$)'), control);
    }
    static route (app, req_str) {
        var control;
        for (let rx of routes.keys()) {
            let ctrl = routes.get(rx);
            if (rx.test(req_str)) {
                control = ctrl;
                break;
            }
        }
        if (control) {
            return new control(app);
        } else {
            console.log('no control');
            app.close();
        }
    }
}

// load controller files
require('./controller.js');

module.exports = ROUTER;