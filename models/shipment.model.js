import { MODEL } from 'model';

var config = MODEL.makeConfig({
    fields: {
        record_id: {
            type:       MODEL.DATA_TYPE.GUID,
            is_primary: true,
        },
        id: {
            type:       MODEL.DATA_TYPE.UINT32,
        },
        'void': {
            type:       MODEL.DATA_TYPE.UINT64,
            nullable:   true,
        },
        record_owner_id: {
            type:       MODEL.DATA_TYPE.UINT32,
        },
        account_id: {
            type:       MODEL.DATA_TYPE.UINT32,
        },
    },
    indexes: {
        record_owner_id: {
            expressions: [
                'record_owner_id',
                'void',
            ],
            type: MODEL.INDEX_TYPE.HASH,
        },
        account_id: {
            expressions: [
                'account_id',
                'void',
            ],
            type: MODEL.INDEX_TYPE.HASH,
        },
    },
    relations: {
        record_owner: {
            type:   MODEL.RELATION_TYPES.ONE_TO_MANY,
            model: 'USER',
            query: 'eq(record_owner_id, user.id)',
            constraints: {
                local_fields: [
                    'account_id',
                ],
                foreign_fields: [
                    'id',
                ],
            },
        },
        account: {
            type:   MODEL.RELATION_TYPES.ONE_TO_MANY,
            model:  'ACCOUNT',
            query:  'eq(account_id, account.id)',
            constraints: {
                local_fields: [
                    'account_id',
                ],
                foreign_fields: [
                    'id',
                ],
            },
        },
    },
});
export default class SHIPMENT extends MODEL {
    static getConfig () {
        return config;
    }
}