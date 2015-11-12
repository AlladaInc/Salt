var APP = require('./app').ROOTAPPCLASS;

class SYS_APP extends APP {
    isSysApp () {
        return true;
    }
}

module.exports = SYS_APP;