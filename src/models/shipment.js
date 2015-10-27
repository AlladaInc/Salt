var MODEL = require('./../classes/model');

var config = {
    tableName: 'shipments',
    fields: {
        record_id: {
            type:       MODEL.DATA_TYPES.GUID,
            is_primary: true,
        },
        id: {
            type:       MODEL.DATA_TYPES.UINT32,
        },
        'void': {
            type:       MODEL.DATA_TYPES.UINT64,
            nullable:   true,
        },
        record_owner_id: {
            type:       MODEL.DATA_TYPES.UINT32,
        },
        account_id: {
            type:       MODEL.DATA_TYPES.UINT32,
        },
    },
    indexes: {
        record_owner_id: {
            expressions: [
                'record_owner_id',
                'void',
            ],
            type: MODEL.INDEX_TYPES.HASH,
        },
        account_id: {
            expressions: [
                'account_id',
                'void',
            ],
            type: MODEL.INDEX_TYPES.HASH,
        },
    },
    relations: {
        record_owner: {
            type:   MODEL.RELATION_TYPES.MANY_TO_ONE,
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
            type:   MODEL.RELATION_TYPES.MANY_TO_ONE,
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
};
class SHIPMENT extends MODEL {
    static getConfig () {
        return config;
    }
}

SHIPMENT.initModel(SHIPMENT.getConfig());

module.exports = SHIPMENT;
