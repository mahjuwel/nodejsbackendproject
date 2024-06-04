const { Schema, model } = require("mongoose");

const productBrandSchema = new Schema({
    name: {
        type: String,
        require: true,
        trim: true
    }
})

const ProductBrand = model('ProductBrand', productBrandSchema);
module.exports = ProductBrand;