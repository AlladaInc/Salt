class CONFIG {
    static get (prop) {
        return this[prop];
    }
}
CONFIG.lang = `${ __dirname }/../../lang/en-US`;
CONFIG.controller_dir = `${ __dirname }/../controllers`;

module.exports = CONFIG;