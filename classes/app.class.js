import { LANG } from 'lang';
import { EVENT } from 'event';
import { TRIGGER } from 'trigger';

class APP {
    static internalError (code, ...args) {
        throw LANG.get(code, ...args);
    }
    static registerEvent (event_name, ...args) {
        if (this.EVENTS[event_name] === undefined) {
            return (this.EVENTS[event_name] = new EVENT(event_name, ...args));
        } else {
            this.internalError(LANG.ERROR_EVENT_ALREADY_REGISTERED, event_name);
        }
    }
    static registerTrigger (event, fn) {
        if (!(event instanceof EVENT)) {
            this.internalError(LANG.ERROR_FIRST_ARGUMENT_NOT_EVENT_OBJ, typeof event);
        }
        if (!(fn instanceof Function)) {
            this.internalError(LANG.ERROR_SECOND_ARGUMENT_NOT_FUNCTION, typeof fn);
        }
        event.addTrigger(new TRIGGER(fn));
    }
    static registerInitName (name) {
        this.INIT_EVENTS.add(name);
    }
    static triggerInitName (name) {
        this.INIT_EVENTS.delete(name);
    }
}
APP.EVENTS = {};
APP.INIT_EVENTS = new Set();

export { APP };
export default APP;