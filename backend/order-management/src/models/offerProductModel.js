const {Schema, model} = require("mongoose");
// const bcrypt = require('bcryptjs');
const offerProductSchema= new Schema({
    companyName: {
        type: String,
        required: [true, "Company name is required"],
        trim: true
    },
   
    categoryName: {
        type: String,
        required: [true, "Category name is required"],
        trim: true       
    },  
 
    skuName: {
        type: String,
        required: [true, "Sku Name is required"],
        trim: true
    },
   
    offerPrice:{
        type: Number,
        default:0,
        trim: true
    },
    unit:{
        type: String,
        trim: true
    },
    weight:{
        type: Number,
        trim: true
    },
       
    status:{
        type: Boolean,
        default: true
    },
    },{timestamps: true});
    const OfferProduct= model('OfferProduct',offerProductSchema);
    module.exports=OfferProduct;