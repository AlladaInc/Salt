var CONFIG = require('./../config/config');
var DATA_TYPES = require('./datatypes');
var PQL = require('./pql');
var APP = require('./app');
var LANG = require('./lang');
var MODEL_FIELD = require('./model_field');
var MODEL_RELATION = require('./model_relation');
var MODEL_INDEX = require('./model_index');
var CF = require('./../classes/common-functions');

let INDEX_TYPES = Object.freeze({
    HASH:       1,
    BTREE:      2,
    RTREE:      3,
});
let RELATION_TYPES = Object.freeze({
    ONE_TO_ONE:     1,
    ONE_TO_MANY:    2,
    MANY_TO_ONE:    3,
});

let models_are_loaded = false;
let loaded_models = new Map();

class MODEL {
    constructor (app, id, readonly) {
        this.app = app;
        readonly = (readonly === undefined ? readonly : true);

        let return_promise = new Promise((resolve, reject) => {
            let record_promise = this.constructor.getRecord(id, readonly);
            record_promise.then((db_data) => {
                this.setData(db_data);
                resolve(this);
            }).catch((reason) => {
                reject(reason);
            });
        });
        return return_promise;
    }
    setData (data_obj) {

    }
    static initModel (config) {
        this.tableName = config.tableName;
        this.fields = new Map();
        this.indexes = new Map();
        this.relations = new Map();

        this.primary_fields = new Set();

        var fields = config.fields;
        for (let field_name in fields) {
            if (fields.hasOwnProperty(field_name)) {
                let field = new MODEL_FIELD(this, field_name, fields[field_name]);
                if (field.is_primary) {
                    this.primary_fields.add(field);
                }
                this.fields.set(field_name, field);
            }
        }
        
        if (this.primary_fields.size === 0) {
            APP.internalError(LANG.ERROR_PRIMARY_FIELD_REQUIRED, this.name);
        }

        if (this.defaultGroupBy === undefined) {
            let defGroups = [];
            this.primary_fields.forEach((field) => {
                defGroups.push(field.fieldName);
            });
            this.defaultGroupBy = defGroups.join(',');
        }

        var indexes = config.indexes;
        for (let index_name in indexes) {
            if (indexes.hasOwnProperty(index_name)) {
                let index = new MODEL_INDEX(this, indexes[index_name]);
                this.indexes.set(index_name, index);
            }
        }

        var relations = config.relations;
        for (let relation_name in relations) {
            if (relations.hasOwnProperty(this, relation_name)) {
                let relation = new MODEL_RELATION(relations[relation_name]);
                this.relations.set(relation_name, relation);
            }
        }

        if (this.defaultOrderBy === undefined) {
            this.defaultOrderBy = null;
        }

        PQL.setupModel(this);
    }
    static getRecord (app, id, readonly) {

    }
    static initalize () {

    }
    static query (app, query_obj, readonly) {
        return PQL.query(app.getRelationalDB(), query_obj);
    }
    static buildQuery (app, query_obj, readonly) {
        if (readonly === undefined) {
            readonly = true;
        } else {
            readonly = false;
        }
        if (query_obj === undefined || query_obj === null) {
            query_obj = {};
        }
        let query       = query_obj.query       || '';
        let group       = query_obj.group       || this.defaultGroupBy;
        let orderBy     = query_obj.orderBy     || this.defaultOrderBy;
        let selects     = this.buildSelects(app, query_obj.selects);
        let variables   = this.buildVariables(app, query_obj.variables);
        let limit       = query_obj.limit       || 100;
        let offset      = query_obj.offset      || 0;

        let ret = PQL.query({
            table:      this.name,
            query:      query,
            group:      group,
            orderBy:    orderBy,
            selects:    selects,
            variables:  variables,
            limit:      limit,
            offset:     offset,
        }, readonly);
        return ret;
    }
    static buildSelects (app, selects) {
        selects = selects || {};
        return selects;
    }
    static buildVariables (app, variables) {
        variables = variables || {};

        variables.now = new Date();
        variables.today = new Date(variables.now.getFullYear(), variables.now.getMonth(), variables.now.getDate());

        variables.current_user_id = app.getCurrentUserId();
        variables.root_user_id = CONFIG.root_user_id;

        variables.request_id = app.getRequestId();
        variables.transaction_id = app.getTransactionId();
        
        variables.current_app_id = app.getCurrentAppId();
        variables.root_app_id = app.getRootAppId();

        return variables;
    }
    static getField (app, field) {
        return this.fields.get(field);
    }
}

MODEL.DATA_TYPES = DATA_TYPES;
MODEL.INDEX_TYPES = INDEX_TYPES;
MODEL.RELATION_TYPES = RELATION_TYPES;

module.exports = MODEL;

console.log('Loading Models...');
APP.registerInitName(__filename);
CF.walk_dir(CONFIG.get('models_dir'), (file) => {
    require(file);
}, () => {
    APP.emit('modelsLoaded');
    console.log('Models Loaded!');
    APP.triggerInitName(__filename);
});