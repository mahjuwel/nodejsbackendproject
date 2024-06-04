const { Schema, model } = require("mongoose");

const outletTypeSchema = new Schema({
    name: {
        type: String,
        require: true,
        trim: true
    }
})

const OutletType = model('OutletType', outletTypeSchema);
module.exports = OutletType;