import { PQL } from 'libs/pql/pql/PQL';
import { Config as PQL_CONFIG } from 'config/pql_config';
import { APP } from 'classes/app';
import { MODEL } from 'classes/model';

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

export { PQL };
export default PQL;