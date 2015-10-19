export function MODELS_LOADED_TRIGGER (test){
    import { APP } from 'app';
    import { MODEL } from 'model';

    APP.registerTrigger(APP.EVENTS.MODELS_LOADED, () => {
        test.ok(true, 'MODELS_LOADED trigger executed before loaded');
        APP.registerTrigger(APP.EVENTS.MODELS_LOADED, () => {
            test.ok(true, 'MODELS_LOADED trigger after loaded');
            test.done();
        });
    });
    MODEL.models_loaded();
}