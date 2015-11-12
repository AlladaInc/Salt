class CONFIG {
    static get (prop) {
        var props = prop.split('.');
        var curObj = this;
        for (let v of props) {
            curObj = curObj[v];
        }
        return curObj;
    }
}
CONFIG.lang = `${ __dirname }/../../lang/en-US`;
CONFIG.controller_dir = `${ __dirname }/../controllers`;
CONFIG.web_view_dir = `${ __dirname }/../views/web`;
CONFIG.models_dir = `${ __dirname }/../models`;
CONFIG.pql_dir = `${ __dirname }/../../libs/pql/compiled/pql`;
CONFIG.root_user_id = 1;

CONFIG.relational_database = {
    user: 'salt2',
    password: 'test',
    connect_string: '172.16.84.99/orcl',
};

module.exports = CONFIG;