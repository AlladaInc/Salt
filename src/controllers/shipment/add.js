var CONTROLLER = require('../../classes/controller.js');
var ROUTER = require('../../classes/router.js');
var SHIPMENT = require('../../models/shipment.js');

class ADD extends CONTROLLER {
    constructor (app) {
        super(app);

        this.view = this._getView('shipment/add');
        this.view.handleVar('result', SHIPMENT.query('id:@id', {id: 5}));
        this.done();
    }
}
ROUTER.addSimpleRoute('shipment/add', ADD);

module.exports = ADD;