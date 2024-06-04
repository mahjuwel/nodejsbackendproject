const { Schema, model } = require("mongoose");

const distributorTypeSchema = new Schema({
    name: {
        type: String,
        require: true,
        trim: true
    }
})

const DistributorType = model('DistributorType', distributorTypeSchema);
module.exports = DistributorType;