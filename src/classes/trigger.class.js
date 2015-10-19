class TRIGGER {
    constructor (fn) {
        this.fn = fn;
    }
    run (event_obj, ...args) {
        return this.fn(event_obj, ...args);
    }
}

export { TRIGGER };
export default TRIGGER;