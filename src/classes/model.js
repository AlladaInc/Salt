var CONFIG = require('./../config/config');
var DATA_TYPES = require('./datatypes');
var PQL = require('./pql');
var APP = require('./app');
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
    constructor (id, readonly) {
        readonly = (readonly === undefined ? readonly : true);
        //super (id, readonly);

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

        var fields = config.fields;
        for (let field_name in fields) {
            if (fields.hasOwnProperty(field_name)) {
                let field = new MODEL_FIELD(this, fields[field_name]);
                this.fields.set(field_name, field);
            }
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
        PQL.setupModel(this);
    }
    static getRecord (id, readonly) {
        let return_promise = new Promise((resolve, reject) => {
            if (readonly) { }
            let query_promise = this.query({
                query: 'id:@id',
                variables: {
                    id: id,
                },
            });
            query_promise.then((db_data) => {
                // This will be a simple object with the queried fields
                resolve(db_data);
                query_promise.cleanup();
            }).catch((reason) => {
                reject(reason);
            });
        });
        return return_promise;
    }
    static query (query, variables) {
        let ret = PQL.getSQL({
            query: query,
            table: this.name,
            variables: variables,
        });
        return ret;
    }
    static areModelsLoaded () {
        return models_are_loaded;
    }
    static triggerModelsLoaded () {
        models_are_loaded = true;
        APP.triggerEvent(APP.EVENTS.MODELS_LOADED);
    }
    static getField (field) {
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
    console.log('Models Loaded!');
    APP.triggerInitName(__filename);
});