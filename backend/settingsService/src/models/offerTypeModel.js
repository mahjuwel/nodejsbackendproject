const { Schema, model } = require("mongoose");

const offerTypeSchema = new Schema({
    name: {
        type: String,
        require: true,
        trim: true
    }
})

const OfferType = model('OfferType', offerTypeSchema);
module.exports = OfferType;