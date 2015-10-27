class MODEL_INDEX {
    constructor (model, config) {
        this.ownerModel = model;
        this.expressions = new Set();
        this.index_type = config.type;

        config.expressions.forEach((v) => {
            this.expressions.add(v);
        });
    }
}
module.exports = MODEL_INDEX;