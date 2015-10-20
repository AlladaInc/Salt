var CONTROLLER = require('../../classes/controller.js');
var ROUTER = require('../../classes/router.js');

class ADD extends CONTROLLER {
    construct (app) {
        console.log(app.id);
    }
}
ROUTER.addRoute(['shipment', 'add'], ADD);

module.exports = ADD;