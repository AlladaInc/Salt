var PQL = require('./../libs/pql/pql/PQL');
var PQL_CONFIG = require('./../config/pql_config');
var APP = require('./app');
var MODEL = require('./model');

APP.registerTrigger(APP.EVENTS.MODELS_LOADED, () => {
    let cfg = {};
    MODEL.LOADED_MODELS.forEach((v) => {
        let modelCfg = v.getConfig();
        let fields = {};

        modelCfg.fields.forEach((v, k) => {
            fields[k] = {
                type: v.type.getPQLType(),
            };
        });

        let linkTo = {};
        let linkFrom = {};

        modelCfg.relations.forEach((v, k) => {
            if (v.type instanceof MODEL.RELATION_TYPES.ONE_TO_MANY) {
                linkFrom[k] = {
                    table: v.model,
                    pql: v.query,
                }; 
            } else {
                linkTo[k] = {
                    table: v.model,
                    pql: v.query,
                }; 
            }
        });
        cfg[v.name] = {
            name: modelCfg.tableName,
            fields: fields,
            linkTo: linkTo,
            linkFrom: linkFrom,
        };
    });
    PQL_CONFIG.DB_MAP = cfg;
});
PQL.defaultConfig = PQL_CONFIG;

module.exports = PQL;