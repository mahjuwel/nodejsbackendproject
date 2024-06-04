const { Schema, model } = require("mongoose");

const dbPointSchema = new Schema({  
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
    dbPointName: {
        type: String,
        require: true,
        trim: true
    },
})

const dbPoint = model('dbPoint', dbPointSchema);
module.exports = dbPoint;