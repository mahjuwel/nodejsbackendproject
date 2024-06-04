const { Schema, model } = require("mongoose");

const areaSchema = new Schema({
    zoneName: {
        type: String,
        require: true,
        trim: true
    },
    regionName: {
        type: String,
        require: true,
        trim: true
    },
    areaName: {
        type: String,
        require: true,
        trim: true
    },
})

const Area = model('Area', areaSchema);
module.exports = Area;