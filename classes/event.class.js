class EVENT {
    constructor (name, {onAddTrigger, onRemoveTrigger, onBeforeRun, onAfterRun} = {}) {
        this.name = name;
        this.runOnce = runOnce;
        this.onAddTrigger = onAddTrigger;
        this.onRemoveTrigger = onRemoveTrigger;
        this.onBeforeRun = onBeforeRun;
        this.onAfterRun = onAfterRun;

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
            res = v.run(this, ...args);
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

export { EVENT };
export default EVENT;