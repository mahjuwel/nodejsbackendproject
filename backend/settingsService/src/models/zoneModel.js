const { Schema, model } = require("mongoose");

const zoneSchema = new Schema({
    name: {
        type: String,
        require: true,
        trim: true
    }
})

const Zone = model('Zone', zoneSchema);
module.exports = Zone;