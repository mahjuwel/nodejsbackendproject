const { Schema, model } = require("mongoose");

const discountTypeSchema = new Schema({
    name: {
        type: String,
        require: true,
        trim: true
    }
})

const DiscountType = model('DiscountType', discountTypeSchema);
module.exports = DiscountType;