class MODEL_RELATION {
    constructor (model, config) {
        this.ownerModel = model;
        this.type = config.type;
        this.model = require('../models/' + config.model.toLowerCase());
    }
}
module.exports = MODEL_RELATION;