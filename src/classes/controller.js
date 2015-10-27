var CONFIG = require('./../config/config');
var APP = require('./app');
var CF = require('./../classes/common-functions');
var VIEW = require('../views/view.js');

class CONTROLLER {
    constructor (app) {
        this.setApp(app);
    }
    _getView (view_str) {
        return VIEW.getView(this, view_str);
    }
    getView () {
        return this.view;
    }
    getApp () {
        return this._app;
    }
    setApp (app) {
        this._app = app;
    }
    done () {
        this.getView().done();
        this.getApp().done();
    }
}
module.exports = CONTROLLER;

console.log('Loading Controllers...');
APP.registerInitName(__filename);
CF.walk_dir(CONFIG.get('controller_dir'), (file) => {
    require(file);
}, () => {
    console.log('Controllers Loaded!');
    APP.triggerInitName(__filename);
});