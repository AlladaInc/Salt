var VIEW = require('../../view.js');
var WEB_APP_VIEW = require('./../web_app_view.js');

var view_handlers = 'shipment/add';

class SHIPMENT_ADD_VIEW extends WEB_APP_VIEW {
    done () {
        this.getApp().send(this.getVar('result'));
    }
    static getViewHandlers () {
        return view_handlers;
    }
}

VIEW.addView(SHIPMENT_ADD_VIEW);

module.exports = SHIPMENT_ADD_VIEW;