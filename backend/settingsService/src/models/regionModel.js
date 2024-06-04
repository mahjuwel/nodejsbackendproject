const { Schema, model } = require("mongoose");

const regionSchema = new Schema({
    zoneName: {
        type: String,
        require: true,
        trim: true
    },
    regionName: {
        type: String,
        require: true,
        trim: true
    }
})

const Region = model('Region', regionSchema);
module.exports = Region;