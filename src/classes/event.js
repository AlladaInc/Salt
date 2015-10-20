var TRIGGER = require('./trigger');

class EVENT {
    constructor (name, config) {
        this.name = name;
        this.onAddTrigger = config.onAddTrigger;
        this.onRemoveTrigger = config.onRemoveTrigger;
        this.onBeforeRun = config.onBeforeRun;
        this.onAfterRun = config.onAfterRun;

        this.triggers = new Set();
    }
    addTrigger (trigger) {
        if (!(trigger instanceof TRIGGER)) {
            APP.internalError(LANG.ERROR_FIRST_ARGUMENT_NOT_TRIGGER, typeof trigger);
        }
        if (!this.triggers.has(trigger)) {
            this.triggers.add(trigger);
            if (this.onAddTrigger) {
                return this.onAddTrigger(this, trigger);
            }
            return true;
        }
        return false;
    }
    removeTrigger (trigger) {
        let res = this.triggers.delete(trigger);
        if (this.onRemoveTrigger) {
            res = this.onRemoveTrigger(this, trigger, res);
        }
        return res;
    }
    removeAllTriggers () {
        this.triggers.forEach((v) => {
            this.removeTrigger(v);
        });
    }
    run (...args) {
        var res;
        if (this.onBeforeRun) {
            res = this.onBeforeRun(this, args);
        }
        for (let v of this.triggers) {
            res = v.run.call(v, [this, ...args]);
            
            if (res !== undefined) {
                break;
            }
        }
        if (this.onAfterRun) {
            res = this.onAfterRun(this, args, res);
        }
        return res;
    }
}

module.exports = EVENT;