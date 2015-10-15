import { DATATYPES } from 'datatypes';
let INDEX_TYPE = Object.freeze({
    HASH:       1,
    BTREE:      2,
    RTREE:      3,
});
let RELATION_TYPES = Object.freeze({
    ONE_TO_ONE:     1,
    ONE_TO_MANY:    2,
    MANY_TO_ONE:    3,
});

export default class MODEL {
    static get DATA_TYPES () { return DATATYPES; }
    //static set DATA_TYPES (v) {}

    static get INDEX_TYPE () { return INDEX_TYPE; }
    //static set INDEX_TYPE (v) {}

    static get RELATION_TYPES () { return RELATION_TYPES; }
    //static set RELATION_TYPES (v) {}
        
    constructor (id, readonly = true) {
        super (id, readonly);

        let return_promise = new Promise((resolve, reject) => {
            let record_promise = this.constructor.getRecord(id, readonly);
            record_promise.then((db_data) => {
                this.setData(db_data);
                resolve(this);
            }).catch((reason) => {
                reject(reason);
            });
        });
        return return_promise;
    }
    setData (data_obj) {

    }
    static getRecord (id, readonly) {
        let return_promise = new Promise((resolve, reject) => {
            if (readonly) { }
            let query_promise = this.query({
                query: 'id:@id',
                variables: {
                    id: id,
                },
            });
            query_promise.then((db_data) => {
                // This will be a simple object with the queried fields
                resolve(db_data);
                query_promise.cleanup();
            }).catch((reason) => {
                reject(reason);
            });
        });
        return return_promise;
    }
    static query ({query, variables}) {
        
    }
}