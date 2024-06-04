const { Schema, model } = require("mongoose");

const outletChannelSchema = new Schema({
    name: {
        type: String,
        require: true,
        trim: true
    }
})

const OutletChannel = model('OutletChannel', outletChannelSchema);
module.exports = OutletChannel;