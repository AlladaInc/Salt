var DATA_TYPES = require('./datatypes');
var APP = require('./app');
var LANG = require('./lang');

class MODEL_FIELD {
    constructor (model, config) {
        this.ownerModel = model;
        var type = config.type;
        if (!(type.prototype instanceof DATA_TYPES)) {
            APP.internalError(LANG.ERROR_TYPE_NOT_INSTANCE_OF_DATATYPE, type.constructor.name);
        }
        this.type       = config.type;
        this.is_primary = (config.size === undefined ? false : config.size);
        this.nullable   = (config.size === undefined ? false : config.size);
        this.size       = (config.size === undefined ? this.type.default_size : config.size);
    }
}

module.exports = MODEL_FIELD;