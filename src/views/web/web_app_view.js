var CONFIG = require('./../../config/config');
var CF = require('./../../classes/common-functions');
var APP = require('./../../classes/web_app');
var VIEW = require('./../view');

var views = new Map();

class WEB_APP_VIEW extends VIEW {

}

module.exports = WEB_APP_VIEW;

console.log('Loading Views...');
APP.registerInitName(__filename);
CF.walk_dir(CONFIG.get('web_view_dir'), (file) => {
    require(file);
}, () => {
    console.log('Views Loaded!');
    APP.triggerInitName(__filename);
});
