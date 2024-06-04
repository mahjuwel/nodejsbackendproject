const { Schema, model } = require("mongoose");

const outletTargetSchema = new Schema({
    name: {
        type: String,
        require: true,
        trim: true
    }
})

const outletTarget = model('OutletTarget', outletTargetSchema);
module.exports = outletTarget;