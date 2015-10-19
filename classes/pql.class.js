import { PQL } from '../libs/pql/pql/PQL';
import { Config } from '../libs/pql/pql/config';
import { APP } from 'app';
import { MODEL } from 'model';

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
    Config.DB_MAP = cfg;
});
PQL.defaultConfig = Config;

export { PQL };
export default PQL;