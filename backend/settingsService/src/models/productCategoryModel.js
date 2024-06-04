const { Schema, model } = require("mongoose");

const productCategorySchema = new Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    catType: {
        type: String,
        default:'Order',
        trim: true
    }
})

const ProductCategory = model('ProductCategory', productCategorySchema);
module.exports = ProductCategory;