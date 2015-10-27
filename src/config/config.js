class CONFIG {
    static get (prop) {
        return this[prop];
    }
}
CONFIG.lang = `${ __dirname }/../../lang/en-US`;
CONFIG.controller_dir = `${ __dirname }/../controllers`;
CONFIG.web_view_dir = `${ __dirname }/../views/web`;
CONFIG.models_dir = `${ __dirname }/../models`;
CONFIG.pql_dir = `${ __dirname }/../../libs/pql/compiled/pql`;
CONFIG.root_user_id = 1;

module.exports = CONFIG;