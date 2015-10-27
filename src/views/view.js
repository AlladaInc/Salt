var LANG = require('./../classes/lang');

var views = new Map();

class VIEW {
    constructor (controller) {
        this._vars = new Map();
        this._controller = controller;
    }
    getController () {
        return this._controller;
    }
    getApp () {
        return this.getController().getApp();
    }
    getVars () {
        return this._vars;
    }
    getVar (name) {
        return this.getVars().get(name);
    }
    
    handleVar (name, data) {
        this._vars.set(name, data);
    }
    static getView (controller, view_str) {
        if (views.has(view_str)) {
            return new (views.get(view_str))(controller);
        } else {
            controller.getApp().internalError(LANG.ERROR_NO_VIEW_FOUND, view_str, controller.name);
        }
    }
    static addView (view) {
        var handlers = view.getViewHandlers();
        if (!Array.isArray(handlers)) {
            handlers = [handlers]; 
        }
        for (let handler of handlers) {
            views.set(handler, view);
        }
    }
}
module.exports = VIEW;